import { Router, Request, Response } from 'express';
import multer from 'multer';
import { telegramService } from '../telegram/telegramService';
import { config } from '../config';

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
    const { reportId, uploadedBy } = req.body;

    if (!file) {
      return res.status(400).json({ error: 'No evidence file provided' });
    }

    const mime = file.mimetype;
    const originalName = file.originalname || 'evidence_file';
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

    return res.status(201).json({
      success: true,
      evidence: evidenceRecord,
    });
  } catch (error: any) {
    console.error('Evidence upload error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to process evidence storage',
    });
  }
});

// Stream authorized evidence securely to police / admin
router.get('/:id/stream', async (req: Request, res: Response) => {
  const { id } = req.params;
  const fileId = req.query.fileId as string;

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
router.delete('/:id', async (req: Request, res: Response) => {
  const messageId = parseInt(req.query.messageId as string, 10);
  if (messageId && telegramService.isConfigured()) {
    try {
      await telegramService.deleteMessage(messageId);
    } catch (e) {
      console.warn('Telegram message delete warning:', e);
    }
  }
  return res.json({ success: true });
});

export default router;
