import { Router, Request, Response } from 'express';
import multer from 'multer';
import { telegramService } from '../telegram/telegramService';
import { config } from '../config';
import { getFirestore } from 'firebase-admin/firestore';
import { requireRoles } from '../middleware/auth';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: config.maxEvidenceFileSizeMb * 1024 * 1024,
  },
});

// Storage status check
router.get('/status', (_req: Request, res: Response) => {
  res.json({
    telegramConfigured: telegramService.isConfigured(),
    maxFileSizeMb: config.maxEvidenceFileSizeMb,
  });
});

// Upload evidence file
router.post('/upload', (req: Request, res: Response, next) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'ফাইলের আকার অনুমোদিত সীমার বেশি।',
        details: `Maximum allowed size is ${config.maxEvidenceFileSizeMb}MB`,
      });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, async (req: Request, res: Response) => {
  try {
    const file = req.file;
    const { reportId } = req.body;
    const user = req.user!;
    if (!reportId) return res.status(400).json({ error: 'reportId is required' });
    const reportSnap = await getFirestore().doc(`reports/${reportId}`).get();
    if (!reportSnap.exists) return res.status(404).json({ error: 'Report not found' });
    const report = reportSnap.data() as any;
    if (user.role === 'PUBLIC_USER' && report.reporterId !== user.uid) return res.status(403).json({ error: 'You cannot upload evidence to this report' });
    if (user.role === 'POLICE_USER' && report.assignedThanaId !== user.assignedThanaId) return res.status(403).json({ error: 'Report is outside your assigned Thana' });
    const uploadedBy = user.uid;

    if (!file) {
      return res.status(400).json({ error: 'No evidence file provided' });
    }

    if (!telegramService.isConfigured()) {
      return res.status(503).json({
        error: 'Evidence storage is temporarily unavailable. Telegram secure storage is not configured.',
      });
    }

    const mime = file.mimetype;
    const originalName = file.originalname || 'evidence_file';
    const allowedMime =
      mime.startsWith('image/') ||
      mime.startsWith('video/') ||
      mime === 'application/pdf' ||
      mime === 'text/plain';

    if (!allowedMime) {
      return res.status(415).json({ error: 'Unsupported evidence file type.' });
    }

    let telegramResult: any = null;

    if (telegramService.isConfigured()) {
      const caption = `[CONFIDENTIAL EVIDENCE]\nReport ID: ${reportId || 'PENDING'}\nUploaded by: ${uploadedBy || 'Citizen'}\nFile: ${originalName}`;
      if (mime.startsWith('image/')) {
        telegramResult = await telegramService.sendPhoto(file.buffer, originalName, caption);
      } else if (mime.startsWith('video/')) {
        telegramResult = await telegramService.sendVideo(file.buffer, originalName, mime, caption);
      } else {
        telegramResult = await telegramService.sendDocument(file.buffer, originalName, mime, caption);
      }
    }

    const evidenceId = `ev_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const evidenceRecord = {
      evidenceId,
      reportId: reportId || 'pending',
      provider: 'telegram',
      telegramMessageId: telegramResult ? telegramResult.messageId : null,
      telegramFileId: telegramResult ? telegramResult.fileId : null,
      fileType: mime,
      fileName: originalName,
      fileSize: file.size,
      uploadedBy: uploadedBy || 'anonymous_reporter',
      uploadedAt: new Date().toISOString(),
      configured: telegramService.isConfigured(),
      notice: telegramService.isConfigured()
        ? 'Stored securely in private Telegram channel'
        : 'Telegram storage is not configured yet. Metadata retained locally.',
    };

    await getFirestore().doc(`evidence/${evidenceId}`).set({ id:evidenceId, ...evidenceRecord });
    await getFirestore().doc(`reports/${reportId}`).update({ evidenceIds: [...new Set([...(report.evidenceIds || []), evidenceId])], updatedAt: new Date().toISOString() });
    return res.status(201).json({ success: true, evidence: evidenceRecord });
  } catch (error: any) {
    console.error('Evidence upload error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to process evidence storage',
    });
  }
});

// Retrieve authorized evidence metadata
router.get('/:id/metadata', async (req: Request, res: Response) => {
  try {
    const snap = await getFirestore().doc(`evidence/${req.params.id}`).get();
    if (!snap.exists) return res.status(404).json({ error: 'Evidence not found' });

    const ev = snap.data() as any;
    const reportSnap = await getFirestore().doc(`reports/${ev.reportId}`).get();
    if (!reportSnap.exists) return res.status(404).json({ error: 'Report not found' });

    const report = reportSnap.data() as any;
    const user = req.user!;
    if (user.role === 'PUBLIC_USER' && report.reporterId !== user.uid) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    if (user.role === 'POLICE_USER' && report.assignedThanaId !== user.assignedThanaId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    return res.json({ success: true, evidence: ev });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to load evidence metadata' });
  }
});

// Stream authorized evidence securely to police / admin
router.get('/:id/stream', async (req: Request, res: Response) => {
  const { id } = req.params;
  const fileId = req.query.fileId as string;
  const snap = await getFirestore().doc(`evidence/${id}`).get();
  if (!snap.exists) return res.status(404).json({ error: 'Evidence not found' });
  const ev=snap.data() as any; const reportSnap=await getFirestore().doc(`reports/${ev.reportId}`).get();
  if(!reportSnap.exists)return res.status(404).json({error:'Report not found'}); const report=reportSnap.data() as any; const u=req.user!;
  if(u.role==='PUBLIC_USER'&&report.reporterId!==u.uid)return res.status(403).json({error:'Forbidden'});
  if(u.role==='POLICE_USER'&&report.assignedThanaId!==u.assignedThanaId)return res.status(403).json({error:'Forbidden'});

  if (!telegramService.isConfigured()) {
    return res.status(503).json({ error: 'Telegram storage is not configured yet.' });
  }

  if (!fileId) {
    return res.status(400).json({ error: 'Missing telegram file identifier' });
  }

  try {
    const fileInfo = await telegramService.getFile(fileId);
    const telegramStream = await fetch(fileInfo.streamUrl);
    if (!telegramStream.ok) {
      return res.status(404).json({ error: 'File not found on Telegram servers' });
    }

    const contentType = telegramStream.headers.get('content-type') || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);
    const buffer = await telegramStream.arrayBuffer();
    return res.send(Buffer.from(buffer));
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error streaming evidence' });
  }
});

// Delete evidence
router.delete('/:id', requireRoles('POLICE_USER','SUPER_ADMIN'), async (req: Request, res: Response) => {
  try {
    const db = getFirestore();
    const ref = db.doc(`evidence/${req.params.id}`);
    const snap = await ref.get();
    if (!snap.exists) return res.status(404).json({ error: 'Evidence not found' });

    const ev = snap.data() as any;
    const reportRef = db.doc(`reports/${ev.reportId}`);
    const reportSnap = await reportRef.get();
    if (!reportSnap.exists) return res.status(404).json({ error: 'Report not found' });

    const report = reportSnap.data() as any;
    const user = req.user!;
    if (user.role === 'POLICE_USER' && report.assignedThanaId !== user.assignedThanaId) {
      return res.status(403).json({ error: 'Evidence is outside your assigned Thana' });
    }

    const messageId = Number(req.query.messageId || ev.telegramMessageId);
    if (messageId && telegramService.isConfigured()) {
      try {
        await telegramService.deleteMessage(messageId);
      } catch (e) {
        console.warn('Telegram message delete warning:', e);
      }
    }

    await ref.delete();
    await reportRef.update({
      evidenceIds: (report.evidenceIds || []).filter((id: string) => id !== ev.evidenceId && id !== req.params.id),
      updatedAt: new Date().toISOString(),
    });

    return res.json({ success: true });
  } catch (error: any) {
    console.error('Evidence delete error:', error);
    return res.status(500).json({ error: error.message || 'Failed to delete evidence' });
  }
});

export default router;
