import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, PoliceUser, UserRole } from '../types';
import { auth, isFirebaseConfigured } from '../lib/firebase';
import { onAuthStateChanged, signOut as fbSignOut } from 'firebase/auth';
import { DEMO_POLICE_USERS } from '../services/mockData';
import { dataService } from '../services/dataService';

export interface AuthContextType {
  currentUser: User | null;
  policeUser: PoliceUser | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginAsPublic: (email: string, fullName?: string) => Promise<void>;
  loginAsPolice: (email: string) => Promise<boolean>;
  loginAsAdmin: (email: string) => Promise<void>;
  registerPublic: (fullName: string, email: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
  switchDemoRole: (role: UserRole, targetThanaId?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [policeUser, setPoliceUser] = useState<PoliceUser | null>(null);
  const [role, setRole] = useState<UserRole>('PUBLIC_USER');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load session from localStorage on start
  useEffect(() => {
    const savedSession = localStorage.getItem('nesha_auth_session');
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        setCurrentUser(parsed.user);
        setPoliceUser(parsed.policeUser || null);
        setRole(parsed.role || 'PUBLIC_USER');
        setIsAuthenticated(true);
      } catch (e) {
        console.error('Failed to parse saved session', e);
      }
    } else {
      // Default to guest or demo public citizen for immediate exploration
      const defaultUser: User = {
        uid: 'citizen_demo_01',
        fullName: 'তানভীর আহমেদ (Tanvir Ahmed)',
        email: 'citizen@example.com',
        phoneNumber: '01711-234567',
        role: 'PUBLIC_USER',
        createdAt: new Date().toISOString(),
      };
      setCurrentUser(defaultUser);
      setRole('PUBLIC_USER');
      setIsAuthenticated(true);
    }
    setIsLoading(false);

    // If Firebase configured, wire onAuthStateChanged
    if (isFirebaseConfigured && auth) {
      const unsub = onAuthStateChanged(auth, (fbUser) => {
        if (!fbUser && !savedSession) {
          // keep local
        }
      });
      return () => unsub();
    }
  }, []);

  const saveSession = (user: User | null, police: PoliceUser | null, userRole: UserRole) => {
    setCurrentUser(user);
    setPoliceUser(police);
    setRole(userRole);
    setIsAuthenticated(Boolean(user));
    if (user) {
      localStorage.setItem(
        'nesha_auth_session',
        JSON.stringify({ user, policeUser: police, role: userRole })
      );
    } else {
      localStorage.removeItem('nesha_auth_session');
    }
  };

  const loginAsPublic = async (email: string, fullName = 'নাগরিক ব্যবহারকারী') => {
    const user: User = {
      uid: `citizen_${Date.now()}`,
      fullName,
      email,
      role: 'PUBLIC_USER',
      createdAt: new Date().toISOString(),
    };
    saveSession(user, null, 'PUBLIC_USER');
  };

  const loginAsPolice = async (email: string): Promise<boolean> => {
    const officers = await dataService.getPoliceUsers();
    const officer = officers.find(
      (o) => o.email.toLowerCase() === email.toLowerCase() && o.isActive
    );

    if (!officer) {
      return false;
    }

    const user: User = {
      uid: officer.uid,
      fullName: officer.fullName,
      email: officer.email,
      role: 'POLICE_USER',
      createdAt: officer.createdAt,
    };

    saveSession(user, officer, 'POLICE_USER');
    await dataService.logAudit({
      userId: officer.uid,
      userName: officer.fullName,
      role: 'POLICE_USER',
      action: 'LOGIN_POLICE',
      metadata: { assignedThanaId: officer.assignedThanaId },
    });

    return true;
  };

  const loginAsAdmin = async (email: string) => {
    const user: User = {
      uid: 'admin_central_01',
      fullName: 'কেন্দ্রীয় সুপার অ্যাডমিন (Central Super Admin)',
      email,
      role: 'SUPER_ADMIN',
      createdAt: '2026-01-01T00:00:00Z',
    };
    saveSession(user, null, 'SUPER_ADMIN');

    await dataService.logAudit({
      userId: user.uid,
      userName: user.fullName,
      role: 'SUPER_ADMIN',
      action: 'LOGIN_ADMIN',
      metadata: { portal: 'CENTRAL_CONTROL' },
    });
  };

  const registerPublic = async (fullName: string, email: string, phone?: string) => {
    const user: User = {
      uid: `citizen_${Date.now()}`,
      fullName,
      email,
      phoneNumber: phone,
      role: 'PUBLIC_USER',
      createdAt: new Date().toISOString(),
    };
    saveSession(user, null, 'PUBLIC_USER');

    await dataService.logAudit({
      userId: user.uid,
      userName: fullName,
      role: 'PUBLIC_USER',
      action: 'USER_REGISTERED',
      metadata: { email },
    });
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      try {
        await fbSignOut(auth);
      } catch (e) {
        console.warn('Firebase signout warning', e);
      }
    }
    saveSession(null, null, 'PUBLIC_USER');
  };

  const switchDemoRole = (targetRole: UserRole, targetThanaId = 'thana_gulshan') => {
    if (targetRole === 'PUBLIC_USER') {
      const citizen: User = {
        uid: 'citizen_demo_01',
        fullName: 'তানভীর আহমেদ (Tanvir Ahmed)',
        email: 'citizen@example.com',
        phoneNumber: '01711-234567',
        role: 'PUBLIC_USER',
        createdAt: '2026-01-01T00:00:00Z',
      };
      saveSession(citizen, null, 'PUBLIC_USER');
    } else if (targetRole === 'POLICE_USER') {
      const officer = DEMO_POLICE_USERS.find((o) => o.assignedThanaId === targetThanaId) || DEMO_POLICE_USERS[0];
      const user: User = {
        uid: officer.uid,
        fullName: officer.fullName,
        email: officer.email,
        role: 'POLICE_USER',
        createdAt: officer.createdAt,
      };
      saveSession(user, officer, 'POLICE_USER');
    } else if (targetRole === 'SUPER_ADMIN') {
      const admin: User = {
        uid: 'admin_central_01',
        fullName: 'মোঃ শামসুল হক (Central Super Admin)',
        email: 'admin@neshareportbd.gov.bd',
        role: 'SUPER_ADMIN',
        createdAt: '2026-01-01T00:00:00Z',
      };
      saveSession(admin, null, 'SUPER_ADMIN');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        policeUser,
        role,
        isAuthenticated,
        isLoading,
        loginAsPublic,
        loginAsPolice,
        loginAsAdmin,
        registerPublic,
        logout,
        switchDemoRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
