import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { NotificationItem } from '../types';
import { dataService } from '../services/dataService';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  refreshNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { role, policeUser, currentUser } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const refreshNotifications = useCallback(async () => {
    try {
      const thanaId = role === 'POLICE_USER' ? policeUser?.assignedThanaId : undefined;
      const uid = currentUser?.uid;
      const list = await dataService.getNotifications(thanaId, uid);
      setNotifications(list);
    } catch (e) {
      console.warn('Failed to fetch notifications', e);
    }
  }, [role, policeUser, currentUser]);

  useEffect(() => {
    refreshNotifications();
    const interval = setInterval(refreshNotifications, 15000);
    return () => clearInterval(interval);
  }, [refreshNotifications]);

  const markAsRead = async (id: string) => {
    await dataService.markNotificationAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        refreshNotifications,
        markAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
