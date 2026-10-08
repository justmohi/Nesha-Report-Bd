import {
  Report,
  ReportedPerson,
  Evidence,
  AuditLog,
  NotificationItem,
  PoliceUser,
  District,
  Upazila,
  Thana,
  UnionItem,
  PublicStatistics,
  ReportStatus,
  UserRole
} from '../types';
import {
  INITIAL_DISTRICTS,
  INITIAL_UPAZILAS,
  INITIAL_THANAS,
  INITIAL_UNIONS,
  DEMO_POLICE_USERS,
  DEMO_REPORTS,
  DEMO_REPORTED_PERSONS,
  DEMO_EVIDENCE,
  DEMO_AUDIT_LOGS,
  DEMO_NOTIFICATIONS,
  DEMO_PUBLIC_STATS
} from './mockData';
import { db, isFirebaseConfigured } from '../lib/firebase';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';

class DataService {
  private reportsKey = 'nesha_reports';
  private personsKey = 'nesha_reported_persons';
  private evidenceKey = 'nesha_evidence';
  private auditKey = 'nesha_audit_logs';
  private notifKey = 'nesha_notifications';
  private policeKey = 'nesha_police_users';
  private districtsKey = 'nesha_districts';
  private thanasKey = 'nesha_thanas';

  constructor() {
    this.initStorage();
  }

  private initStorage() {
    if (!localStorage.getItem(this.reportsKey)) {
      localStorage.setItem(this.reportsKey, JSON.stringify(DEMO_REPORTS));
    }
    if (!localStorage.getItem(this.personsKey)) {
      localStorage.setItem(this.personsKey, JSON.stringify(DEMO_REPORTED_PERSONS));
    }
    if (!localStorage.getItem(this.evidenceKey)) {
      localStorage.setItem(this.evidenceKey, JSON.stringify(DEMO_EVIDENCE));
    }
    if (!localStorage.getItem(this.auditKey)) {
      localStorage.setItem(this.auditKey, JSON.stringify(DEMO_AUDIT_LOGS));
    }
    if (!localStorage.getItem(this.notifKey)) {
      localStorage.setItem(this.notifKey, JSON.stringify(DEMO_NOTIFICATIONS));
    }
    if (!localStorage.getItem(this.policeKey)) {
      localStorage.setItem(this.policeKey, JSON.stringify(DEMO_POLICE_USERS));
    }
    if (!localStorage.getItem(this.districtsKey)) {
      localStorage.setItem(this.districtsKey, JSON.stringify(INITIAL_DISTRICTS));
    }
    if (!localStorage.getItem(this.thanasKey)) {
      localStorage.setItem(this.thanasKey, JSON.stringify(INITIAL_THANAS));
    }
  }

  // --- Jurisdictions ---
  async getDistricts(): Promise<District[]> {
    const raw = localStorage.getItem(this.districtsKey);
    return raw ? JSON.parse(raw) : INITIAL_DISTRICTS;
  }

  async getUpazilas(districtId?: string): Promise<Upazila[]> {
    if (!districtId) return INITIAL_UPAZILAS;
    return INITIAL_UPAZILAS.filter((u) => u.districtId === districtId);
  }

  async getThanas(upazilaId?: string, districtId?: string): Promise<Thana[]> {
    const raw = localStorage.getItem(this.thanasKey);
    const list: Thana[] = raw ? JSON.parse(raw) : INITIAL_THANAS;
    return list.filter((t) => {
      if (upazilaId && t.upazilaId !== upazilaId) return false;
      if (districtId && t.districtId !== districtId) return false;
      return true;
    });
  }

  async getUnions(thanaId?: string): Promise<UnionItem[]> {
    if (!thanaId) return INITIAL_UNIONS;
    return INITIAL_UNIONS.filter((u) => u.thanaId === thanaId);
  }

  // --- Reports ---
  async getReports(userRole: UserRole, userId: string, assignedThanaId?: string): Promise<Report[]> {
    const raw = localStorage.getItem(this.reportsKey);
    const all: Report[] = raw ? JSON.parse(raw) : DEMO_REPORTS;

    if (userRole === 'SUPER_ADMIN') {
      return all;
    }

    if (userRole === 'POLICE_USER') {
      if (!assignedThanaId) return [];
      // Police users can only see reports assigned to their Thana
      return all.filter((r) => r.assignedThanaId === assignedThanaId);
    }

    // Public users can only see their own reports
    return all.filter((r) => r.reporterId === userId);
  }

  async getReportById(reportId: string, userRole: UserRole, userId: string, assignedThanaId?: string): Promise<Report | null> {
    const raw = localStorage.getItem(this.reportsKey);
    const all: Report[] = raw ? JSON.parse(raw) : DEMO_REPORTS;
    const report = all.find((r) => r.id === reportId || r.reportId === reportId) || null;

    if (!report) return null;

    // Security Verification
    if (userRole === 'SUPER_ADMIN') {
      await this.logAudit({
        userId,
        role: userRole,
        action: 'REPORT_ACCESSED',
        reportId: report.id,
        metadata: { viewer: 'SUPER_ADMIN' },
      });
      return report;
    }

    if (userRole === 'POLICE_USER') {
      if (report.assignedThanaId !== assignedThanaId) {
        throw new Error('Unauthorized: You cannot access reports outside your assigned Thana.');
      }
      await this.logAudit({
        userId,
        role: userRole,
        action: 'REPORT_ACCESSED_POLICE',
        reportId: report.id,
        metadata: { thanaId: assignedThanaId },
      });
      return report;
    }

    // Public user
    if (report.reporterId !== userId) {
      throw new Error('Unauthorized: You can only access your own submitted reports.');
    }

    return report;
  }

  async findReportByTracking(reportId: string, pin: string): Promise<Report | null> {
    const raw = localStorage.getItem(this.reportsKey);
    const all: Report[] = raw ? JSON.parse(raw) : DEMO_REPORTS;
    const cleanId = reportId.trim().toUpperCase();
    const cleanPin = pin.trim();

    return all.find((r) =>
      r.reportId.toUpperCase() === cleanId &&
      (!r.trackingPin || r.trackingPin === cleanPin)
    ) || null;
  }

  async createReport(
    reportData: Omit<Report, 'id' | 'reportId' | 'status' | 'statusHistory' | 'createdAt' | 'updatedAt'>,
    personData?: Omit<ReportedPerson, 'id' | 'personId' | 'reportId' | 'createdAt'>
  ): Promise<Report> {
    const raw = localStorage.getItem(this.reportsKey);
    const all: Report[] = raw ? JSON.parse(raw) : DEMO_REPORTS;

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newReportId = `rep_${Date.now()}`;
    const formattedId = `REP-${new Date().getFullYear()}-${reportData.jurisdiction.districtName ? reportData.jurisdiction.districtName.substring(0, 2).toUpperCase() : 'BD'}-${randomSuffix}`;
    const generatedPin = Math.floor(1000 + Math.random() * 9000).toString();

    let createdPersonId: string | undefined = undefined;

    // Confidential Reported Person
    if (personData && (personData.name || personData.alias || personData.description)) {
      createdPersonId = `person_${Date.now()}`;
      const newPerson: ReportedPerson = {
        ...personData,
        id: createdPersonId,
        personId: createdPersonId,
        reportId: newReportId,
        createdAt: new Date().toISOString(),
      };
      const rawPersons = localStorage.getItem(this.personsKey);
      const persons: ReportedPerson[] = rawPersons ? JSON.parse(rawPersons) : DEMO_REPORTED_PERSONS;
      persons.push(newPerson);
      localStorage.setItem(this.personsKey, JSON.stringify(persons));
    }

    const newReport: Report = {
      ...reportData,
      id: newReportId,
      reportId: formattedId,
      trackingPin: generatedPin,
      hasReportedPerson: Boolean(createdPersonId),
      reportedPersonId: createdPersonId,
      status: 'SUBMITTED',
      statusHistory: [
        {
          status: 'SUBMITTED',
          timestamp: new Date().toISOString(),
          updatedBy: reportData.reporterName || 'Citizen Reporter',
          role: 'PUBLIC_USER',
          notes: 'অনলাইনে গোপনীয়ভাবে প্রাথমিক রিপোর্ট জমা হয়েছে।',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    all.unshift(newReport);
    localStorage.setItem(this.reportsKey, JSON.stringify(all));

    // Audit log
    await this.logAudit({
      userId: reportData.reporterId,
      userName: reportData.reporterName,
      role: 'PUBLIC_USER',
      action: 'REPORT_CREATED',
      reportId: newReport.id,
      metadata: {
        assignedThanaId: newReport.assignedThanaId,
        incidentType: newReport.incidentType,
      },
    });

    // Notify assigned Thana
    await this.createNotification({
      targetThanaId: newReport.assignedThanaId,
      title: 'নতুন রিপোর্ট জমা হয়েছে',
      message: `${newReport.jurisdiction.thanaName} এ নতুন একটি মাদক সংক্রান্ত রিপোর্ট (${newReport.reportId}) জমা হয়েছে।`,
      reportId: newReport.id,
    });

    return newReport;
  }

  async updateReportStatus(
    reportId: string,
    newStatus: ReportStatus,
    updatedByOfficer: { uid: string; name: string; thanaId: string; role: UserRole },
    notes?: string,
    actionDetails?: string
  ): Promise<Report> {
    const raw = localStorage.getItem(this.reportsKey);
    const all: Report[] = raw ? JSON.parse(raw) : DEMO_REPORTS;
    const index = all.findIndex((r) => r.id === reportId || r.reportId === reportId);

    if (index === -1) {
      throw new Error('Report not found');
    }

    const report = all[index];

    // Enforce Thana segregation for police
    if (updatedByOfficer.role === 'POLICE_USER' && report.assignedThanaId !== updatedByOfficer.thanaId) {
      throw new Error('Unauthorized: You can only update reports assigned to your Thana.');
    }

    const historyItem = {
      status: newStatus,
      timestamp: new Date().toISOString(),
      updatedBy: updatedByOfficer.name,
      role: updatedByOfficer.role,
      notes: notes || `অবস্থা পরিবর্তিত হয়ে '${newStatus}' করা হয়েছে।`,
    };

    report.status = newStatus;
    report.statusHistory.push(historyItem);
    report.updatedAt = new Date().toISOString();

    if (notes) {
      report.policeNotes = notes;
    }
    if (actionDetails) {
      report.actionTakenDetails = actionDetails;
    }

    all[index] = report;
    localStorage.setItem(this.reportsKey, JSON.stringify(all));

    // Audit log
    await this.logAudit({
      userId: updatedByOfficer.uid,
      userName: updatedByOfficer.name,
      role: updatedByOfficer.role,
      action: 'STATUS_UPDATED',
      reportId: report.id,
      metadata: {
        previousStatus: report.status,
        newStatus,
        thanaId: report.assignedThanaId,
      },
    });

    // Notify Reporter
    await this.createNotification({
      recipientId: report.reporterId,
      title: 'রিপোর্টের অবস্থা হালনাগাদ',
      message: `আপনার রিপোর্ট (${report.reportId}) এর তদন্তের অগ্রগতি: ${newStatus}`,
      reportId: report.id,
    });

    return report;
  }

  // --- Confidential Reported Person ---
  async getReportedPerson(personId: string, userRole: UserRole, thanaId?: string): Promise<ReportedPerson | null> {
    // PUBLIC_USER CAN NEVER ACCESS PERSON DATA
    if (userRole === 'PUBLIC_USER') {
      throw new Error('Unauthorized: Reported person data is confidential and restricted.');
    }

    const rawPersons = localStorage.getItem(this.personsKey);
    const persons: ReportedPerson[] = rawPersons ? JSON.parse(rawPersons) : DEMO_REPORTED_PERSONS;
    const person = persons.find((p) => p.id === personId || p.personId === personId) || null;

    if (!person) return null;

    if (userRole === 'POLICE_USER') {
      const rawReports = localStorage.getItem(this.reportsKey);
      const reports: Report[] = rawReports ? JSON.parse(rawReports) : DEMO_REPORTS;
      const associatedReport = reports.find((r) => r.id === person.reportId);
      if (!associatedReport || associatedReport.assignedThanaId !== thanaId) {
        throw new Error('Unauthorized: You cannot access person data outside your assigned Thana.');
      }
    }

    return person;
  }

  // --- Evidence ---
  async getEvidenceForReport(reportId: string, userRole: UserRole, userId: string, thanaId?: string): Promise<Evidence[]> {
    const rawEv = localStorage.getItem(this.evidenceKey);
    const evidenceList: Evidence[] = rawEv ? JSON.parse(rawEv) : DEMO_EVIDENCE;
    const filtered = evidenceList.filter((e) => e.reportId === reportId);

    // Verify permission
    const rawReports = localStorage.getItem(this.reportsKey);
    const reports: Report[] = rawReports ? JSON.parse(rawReports) : DEMO_REPORTS;
    const report = reports.find((r) => r.id === reportId);

    if (!report) return [];

    if (userRole === 'PUBLIC_USER' && report.reporterId !== userId) {
      throw new Error('Unauthorized access to evidence');
    }

    if (userRole === 'POLICE_USER' && report.assignedThanaId !== thanaId) {
      throw new Error('Unauthorized access to evidence outside assigned Thana');
    }

    // Log evidence access for police
    if (userRole === 'POLICE_USER') {
      await this.logAudit({
        userId,
        role: userRole,
        action: 'EVIDENCE_ACCESSED',
        reportId,
        metadata: { thanaId, count: filtered.length },
      });
    }

    return filtered;
  }

  async addEvidence(evidenceData: Omit<Evidence, 'id' | 'evidenceId' | 'uploadedAt'>): Promise<Evidence> {
    const rawEv = localStorage.getItem(this.evidenceKey);
    const evidenceList: Evidence[] = rawEv ? JSON.parse(rawEv) : DEMO_EVIDENCE;

    const newEvidence: Evidence = {
      ...evidenceData,
      id: `ev_${Date.now()}`,
      evidenceId: `ev_${Date.now()}`,
      uploadedAt: new Date().toISOString(),
    };

    evidenceList.push(newEvidence);
    localStorage.setItem(this.evidenceKey, JSON.stringify(evidenceList));

    // Link into report
    const rawReports = localStorage.getItem(this.reportsKey);
    const reports: Report[] = rawReports ? JSON.parse(rawReports) : DEMO_REPORTS;
    const report = reports.find((r) => r.id === evidenceData.reportId);
    if (report) {
      if (!report.evidenceIds.includes(newEvidence.id)) {
        report.evidenceIds.push(newEvidence.id);
      }
      localStorage.setItem(this.reportsKey, JSON.stringify(reports));
    }

    return newEvidence;
  }

  // --- Audit Logs ---
  async logAudit(logData: {
    userId: string;
    userName?: string;
    role: string;
    action: string;
    reportId?: string;
    evidenceId?: string;
    metadata?: Record<string, any>;
  }): Promise<AuditLog> {
    const raw = localStorage.getItem(this.auditKey);
    const logs: AuditLog[] = raw ? JSON.parse(raw) : DEMO_AUDIT_LOGS;

    const newLog: AuditLog = {
      id: `log_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      logId: `AUD-${Date.now().toString().slice(-6)}`,
      userId: logData.userId,
      userName: logData.userName || 'Anonymous/System',
      role: logData.role,
      action: logData.action,
      reportId: logData.reportId,
      evidenceId: logData.evidenceId,
      ipAddress: '103.' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255),
      timestamp: new Date().toISOString(),
      metadata: logData.metadata,
    };

    logs.unshift(newLog);
    // Keep max 500 logs
    if (logs.length > 500) logs.pop();
    localStorage.setItem(this.auditKey, JSON.stringify(logs));
    return newLog;
  }

  async getAuditLogs(): Promise<AuditLog[]> {
    const raw = localStorage.getItem(this.auditKey);
    return raw ? JSON.parse(raw) : DEMO_AUDIT_LOGS;
  }

  // --- Notifications ---
  async createNotification(notif: {
    targetThanaId?: string;
    recipientId?: string;
    title: string;
    message: string;
    reportId?: string;
  }): Promise<NotificationItem> {
    const raw = localStorage.getItem(this.notifKey);
    const list: NotificationItem[] = raw ? JSON.parse(raw) : DEMO_NOTIFICATIONS;

    const newItem: NotificationItem = {
      id: `notif_${Date.now()}`,
      notificationId: `NOTIF-${Date.now().toString().slice(-4)}`,
      targetThanaId: notif.targetThanaId,
      recipientId: notif.recipientId,
      title: notif.title,
      message: notif.message,
      reportId: notif.reportId,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    list.unshift(newItem);
    localStorage.setItem(this.notifKey, JSON.stringify(list));
    return newItem;
  }

  async getNotifications(thanaId?: string, userId?: string): Promise<NotificationItem[]> {
    const raw = localStorage.getItem(this.notifKey);
    const list: NotificationItem[] = raw ? JSON.parse(raw) : DEMO_NOTIFICATIONS;

    return list.filter((n) => {
      if (thanaId && n.targetThanaId === thanaId) return true;
      if (userId && n.recipientId === userId) return true;
      return false;
    });
  }

  async markNotificationAsRead(id: string): Promise<void> {
    const raw = localStorage.getItem(this.notifKey);
    const list: NotificationItem[] = raw ? JSON.parse(raw) : DEMO_NOTIFICATIONS;
    const item = list.find((n) => n.id === id);
    if (item) {
      item.isRead = true;
      localStorage.setItem(this.notifKey, JSON.stringify(list));
    }
  }

  // --- Police User Management (Admin) ---
  async getPoliceUsers(): Promise<PoliceUser[]> {
    const raw = localStorage.getItem(this.policeKey);
    return raw ? JSON.parse(raw) : DEMO_POLICE_USERS;
  }

  async createPoliceUser(officer: Omit<PoliceUser, 'uid' | 'createdAt'>): Promise<PoliceUser> {
    const raw = localStorage.getItem(this.policeKey);
    const list: PoliceUser[] = raw ? JSON.parse(raw) : DEMO_POLICE_USERS;

    const newOfficer: PoliceUser = {
      ...officer,
      uid: `police_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    list.push(newOfficer);
    localStorage.setItem(this.policeKey, JSON.stringify(list));

    await this.logAudit({
      userId: 'super_admin',
      role: 'SUPER_ADMIN',
      action: 'POLICE_ACCOUNT_CREATED',
      metadata: { badgeNumber: officer.badgeNumber, thanaId: officer.assignedThanaId },
    });

    return newOfficer;
  }

  async togglePoliceAccountStatus(uid: string): Promise<PoliceUser | null> {
    const raw = localStorage.getItem(this.policeKey);
    const list: PoliceUser[] = raw ? JSON.parse(raw) : DEMO_POLICE_USERS;
    const officer = list.find((o) => o.uid === uid);
    if (!officer) return null;

    officer.isActive = !officer.isActive;
    localStorage.setItem(this.policeKey, JSON.stringify(list));

    await this.logAudit({
      userId: 'super_admin',
      role: 'SUPER_ADMIN',
      action: officer.isActive ? 'POLICE_ACCOUNT_ACTIVATED' : 'POLICE_ACCOUNT_DISABLED',
      metadata: { targetOfficerUid: uid, badgeNumber: officer.badgeNumber },
    });

    return officer;
  }

  // --- Public Statistics ---
  async getPublicStatistics(): Promise<PublicStatistics> {
    const rawReports = localStorage.getItem(this.reportsKey);
    const reports: Report[] = rawReports ? JSON.parse(rawReports) : DEMO_REPORTS;

    const underReview = reports.filter((r) => r.status === 'UNDER_REVIEW').length;
    const verified = reports.filter((r) => r.status === 'VERIFIED').length;
    const actionTaken = reports.filter((r) => r.status === 'ACTION_TAKEN').length;

    return {
      ...DEMO_PUBLIC_STATS,
      totalReports: DEMO_PUBLIC_STATS.totalReports + reports.length,
      underReview: DEMO_PUBLIC_STATS.underReview + underReview,
      verifiedIncidents: DEMO_PUBLIC_STATS.verifiedIncidents + verified,
      actionTaken: DEMO_PUBLIC_STATS.actionTaken + actionTaken,
    };
  }
}

export const dataService = new DataService();
export default dataService;
