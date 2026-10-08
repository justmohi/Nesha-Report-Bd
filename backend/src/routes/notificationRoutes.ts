import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const { thanaId, userId } = req.query;
  res.json({
    success: true,
    notifications: [],
    message: `Station notifications query for thana: ${thanaId || 'all'}, user: ${userId || 'all'}`,
  });
});

export default router;
