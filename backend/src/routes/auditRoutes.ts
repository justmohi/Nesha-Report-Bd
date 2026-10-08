import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Authorized audit trail query',
  });
});

export default router;
