export type UserRole = 'PUBLIC_USER' | 'POLICE_USER' | 'SUPER_ADMIN';

export type ReportStatus =
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'VERIFIED'
  | 'REJECTED'
  | 'ACTION_TAKEN'
  | 'CLOSED';

export type IncidentCategory =
  | 'SUSPECTED_USE'
  | 'SUSPECTED_SELLING'
  | 'SUSPECTED_DISTRIBUTION'
  | 'SUSPECTED_POSSESSION'
  | 'GANJA'
  | 'YABA'
  | 'HEROIN'
  | 'PHENSEDYL'
  | 'TRAMADOL_TABLETS'
  | 'OTHER'
  | 'UNKNOWN';

export interface User { uid:string; fullName:string; email:string; phoneNumber?:string; role:UserRole; createdAt:string; }
export interface PoliceUser { uid:string; fullName:string; email:string; badgeNumber:string; rank:string; assignedDistrictId:string; assignedThanaId:string; thanaNameBn:string; thanaNameEn:string; isActive:boolean; createdAt:string; }
export interface StatusHistoryItem { status:ReportStatus; timestamp:string; updatedBy:string; role:UserRole; notes?:string; }
export interface ReportJurisdiction { districtId:string; districtName:string; upazilaId:string; upazilaName:string; thanaId:string; thanaName:string; unionId?:string; unionName?:string; villageId?:string; villageArea?:string; roadLandmark?:string; }
export interface ReportLocation { latitude?:number; longitude?:number; generalArea?:string; }
export interface Report { id:string; reportId:string; reporterId:string; reporterName?:string; reporterPhone?:string; trackingPin?:string; jurisdiction:ReportJurisdiction; incidentType:IncidentCategory; description:string; incidentDate:string; incidentTime:string; location?:ReportLocation; hasReportedPerson?:boolean; reportedPersonId?:string; evidenceIds:string[]; assignedThanaId:string; status:ReportStatus; statusHistory:StatusHistoryItem[]; policeNotes?:string; actionTakenDetails?:string; createdAt:string; updatedAt:string; }
export interface ReportedPerson { id:string; personId:string; reportId:string; name?:string; alias?:string; approximateAge?:number; gender?:string; description?:string; knownArea?:string; additionalNotes?:string; photoEvidenceId?:string; createdAt:string; }
export interface Evidence { id:string; evidenceId:string; reportId:string; provider:'telegram'; telegramMessageId?:number; telegramFileId?:string; fileType:string; fileName:string; fileSize:number; uploadedBy:string; uploadedAt:string; fileUrl?:string; previewUrl?:string; }
export interface AuditLog { id:string; logId:string; userId:string; userName?:string; role:UserRole|string; action:string; reportId?:string; evidenceId?:string; ipAddress?:string; timestamp:string; metadata?:Record<string,any>; }
export interface NotificationItem { id:string; notificationId:string; targetThanaId?:string; recipientId?:string; title:string; message:string; reportId?:string; isRead:boolean; createdAt:string; }
export interface District { id:string; nameEn:string; nameBn:string; division:string; }
export interface Upazila { id:string; districtId:string; nameEn:string; nameBn:string; }
export type ThanaSource = 'BANGLADESH_POLICE' | 'ADDRESS_REGISTRY' | 'LEGACY_GEO';
export interface Thana { id:string; upazilaId?:string; districtId:string; nameEn:string; nameBn:string; code?:string; source?:ThanaSource; policeUnit?:string; sourceDistrictNameEn?:string; sourceUrl?:string; }
export interface UnionItem { id:string; upazilaId:string; nameEn:string; nameBn:string; }
export interface VillageItem { id:string; unionId:string; nameEn:string; nameBn:string; }
export interface PublicStatistics { totalReports:number; underReview:number; verifiedIncidents:number; actionTaken:number; areasCovered:number; categoryDistribution:{category:IncidentCategory;nameBn:string;nameEn:string;count:number;}[]; monthlyTrends:{month:string;count:number;}[]; }
export interface HomeBanner { id:string; imageUrl:string; titleBn:string; titleEn:string; subtitleBn?:string; subtitleEn?:string; buttonLabelBn?:string; buttonLabelEn?:string; buttonTab?:string; order:number; isActive:boolean; updatedAt:string; }
