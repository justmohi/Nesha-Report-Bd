import { Router, Request, Response } from 'express';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { requireRoles } from '../middleware/auth';

const router = Router();

router.post('/police-users', requireRoles('SUPER_ADMIN'), async (req: Request, res: Response) => {
  try {
    const {
      fullName,
      badgeNumber,
      rank,
      assignedDistrictId,
      assignedThanaId,
      thanaNameBn,
      thanaNameEn,
      email,
      password,
    } = req.body || {};

    if (!fullName || !badgeNumber || !rank || !assignedDistrictId || !assignedThanaId || !thanaNameBn || !thanaNameEn || !email || !password) {
      return res.status(400).json({ error: 'All police account fields are required.' });
    }
    if (typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters.' });
    }

    const auth = getAuth();
    const db = getFirestore();
    const user = await auth.createUser({
      email: String(email).trim().toLowerCase(),
      password,
      displayName: String(fullName).trim(),
      disabled: false,
    });

    const now = new Date().toISOString();
    const profile = {
      uid: user.uid,
      fullName: String(fullName).trim(),
      email: user.email,
      role: 'POLICE_USER',
      createdAt: now,
      updatedAt: now,
    };
    const police = {
      uid: user.uid,
      fullName: String(fullName).trim(),
      email: user.email,
      badgeNumber: String(badgeNumber).trim(),
      rank: String(rank).trim(),
      assignedDistrictId: String(assignedDistrictId),
      assignedThanaId: String(assignedThanaId),
      thanaNameBn: String(thanaNameBn),
      thanaNameEn: String(thanaNameEn),
      isActive: true,
      createdAt: now,
    };

    try {
      await db.doc(`users/${user.uid}`).set(profile);
      await db.doc(`policeUsers/${user.uid}`).set(police);
    } catch (writeError) {
      await auth.deleteUser(user.uid).catch(() => undefined);
      throw writeError;
    }

    return res.status(201).json({ success: true, policeUser: police });
  } catch (error: any) {
    console.error('Police account creation error:', error);
    if (error?.code === 'auth/email-already-exists') return res.status(409).json({ error: 'An account with this email already exists.' });
    if (error?.code === 'auth/invalid-email') return res.status(400).json({ error: 'Invalid email address.' });
    return res.status(500).json({ error: error?.message || 'Failed to create police account.' });
  }
});

export default router;
