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

    const values = {
      fullName: typeof fullName === 'string' ? fullName.trim() : '',
      badgeNumber: typeof badgeNumber === 'string' ? badgeNumber.trim() : '',
      rank: typeof rank === 'string' ? rank.trim() : '',
      assignedDistrictId: typeof assignedDistrictId === 'string' ? assignedDistrictId.trim() : '',
      assignedThanaId: typeof assignedThanaId === 'string' ? assignedThanaId.trim() : '',
      thanaNameBn: typeof thanaNameBn === 'string' ? thanaNameBn.trim() : '',
      thanaNameEn: typeof thanaNameEn === 'string' ? thanaNameEn.trim() : '',
      email: typeof email === 'string' ? email.trim().toLowerCase() : '',
    };
    if (Object.values(values).some((value) => !value)) {
      return res.status(400).json({ error: 'All police account fields are required.' });
    }
    if (typeof password !== 'string' || password.trim() !== password || password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters and must not have leading or trailing spaces.' });
    }

    const auth = getAuth();
    const db = getFirestore();

    // Validate the jurisdiction relationship server-side; the admin UI is not trusted.
    const thanaSnap = await db.doc(`policeStations/${values.assignedThanaId}`).get();
    if (thanaSnap.exists) {
      const thana = thanaSnap.data() as any;
      if (thana.districtId && thana.districtId !== values.assignedDistrictId) {
        return res.status(400).json({ error: 'Assigned Thana does not belong to the selected district.' });
      }
    }

    const duplicateBadge = await db.collection('policeUsers').where('badgeNumber', '==', values.badgeNumber).limit(1).get();
    if (!duplicateBadge.empty) {
      return res.status(409).json({ error: 'A police account with this badge number already exists.' });
    }

    const user = await auth.createUser({
      email: values.email,
      password,
      displayName: values.fullName,
      disabled: false,
    });

    const now = new Date().toISOString();
    const profile = {
      uid: user.uid,
      fullName: values.fullName,
      email: user.email,
      role: 'POLICE_USER',
      createdAt: now,
      updatedAt: now,
    };
    const police = {
      uid: user.uid,
      fullName: values.fullName,
      email: user.email,
      badgeNumber: values.badgeNumber,
      rank: values.rank,
      assignedDistrictId: values.assignedDistrictId,
      assignedThanaId: values.assignedThanaId,
      thanaNameBn: values.thanaNameBn,
      thanaNameEn: values.thanaNameEn,
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
