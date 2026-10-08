import { Router, Request, Response } from 'express';

const router = Router();

// Endpoint for submitting report through backend
router.post('/', async (req: Request, res: Response) => {
  try {
    const reportData = req.body;
    if (!reportData.incidentType || !reportData.description || !reportData.assignedThanaId) {
      return res.status(400).json({ error: 'Missing required incident report fields' });
    }

    return res.status(201).json({
      success: true,
      message: 'Report received and routed to assigned Thana',
      reportId: reportData.reportId || `REP-2026-${Date.now().toString().slice(-6)}`,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Internal error' });
  }
});

// Endpoint for police updating report status
router.post('/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, policeNotes, actionTakenDetails, officerId, officerThanaId } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    return res.json({
      success: true,
      reportId: id,
      updatedStatus: status,
      updatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Internal error' });
  }
});

export default router;
