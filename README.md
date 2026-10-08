# Nesha Report BD (নেশা রিপোর্ট বিডি)

> **Confidential Drug-Related Incident Reporting and Law-Enforcement Information Management Platform for Bangladesh**

---

## 1. Project Overview & Legal/Privacy Architecture

**Nesha Report BD** is a production-ready, confidential incident reporting and police workflow management platform built specifically for Bangladesh.

### ⚠️ Critical Legal & Privacy Invariant: NOT A Public Blacklist
- A public citizen may submit a report about a suspected drug-related incident, but **the system never publicly labels a person as a "drug addict", "criminal", or "drug dealer" based only on an unverified report.**
- **Strict Confidentiality**: Personal identities, suspect names, photographs, videos, exact addresses, evidence files, reporter identity, and police investigation notes remain strictly private.
- Only authorized police officers assigned to the relevant Thana and Super Admins can access confidential suspect data and evidence.
- The public website displays **only anonymized statistics and aggregated general zonal summaries** (e.g., *"Mirpur area — 24 reported incidents"* without ever showing individual names or coordinates).

---

## 2. System Roles & Access Control

| Role | Permissions & Scope |
|---|---|
| **Public User** | Register, submit confidential incident reports, upload evidence, select Thana & location, track own reports, view progress timeline with tracking PIN. **Cannot browse other users' reports, cannot see police notes, cannot view suspect info.** |
| **Police User** | Thana-scoped law enforcement officer. **Strictly restricted to reports assigned to their own Thana station.** Can inspect confidential suspect details, view authorized evidence with audit logging, add internal investigation notes, and change status (`SUBMITTED` ➔ `UNDER_REVIEW` ➔ `VERIFIED` / `REJECTED` ➔ `ACTION_TAKEN` ➔ `CLOSED`). |
| **Super Admin** | Central Narcotics Control authority. Nationwide jurisdiction view, manages police accounts, assigns officers to Thanas, inspects immutable audit logs, manages jurisdictions, and audits storage health. |

---

## 3. Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons
- **Backend & API**: Express.js, TypeScript, Multer, Vite middleware
- **Database & Auth**: Firebase Firestore (Strict ABAC Security Rules in `firestore.rules`), Firebase Authentication
- **Private Evidence Vault**: Telegram Bot API storing encrypted evidence in a **Private Telegram Channel** (server-side only; tokens never exposed to frontend)
- **Internationalization**: Full bilingual support (Bangla default + English)

---

## 4. Evidence Storage Architecture (Telegram Private Channel)

Evidence files (photographs, videos, documents) are **never stored in Firestore** and never exposed via public URLs:

```
[Public Citizen] 
      ↓
[Secure Web Frontend] (Checks MAX_EVIDENCE_FILE_SIZE_MB = 20MB)
      ↓
[Backend API (/api/evidence/upload)] (Authenticates user & validates report)
      ↓
[Telegram Bot API] (sendPhoto / sendVideo / sendDocument)
      ↓
[Private Telegram Channel Vault]
      ↓
[Firestore] (Stores only metadata: { evidenceId, reportId, telegramMessageId, telegramFileId, fileType, uploadedBy })
```

### Secure Authorized Retrieval for Police:
```
[Police Officer] ➔ [Authenticated Request] ➔ [Verify Thana Assignment] ➔ [Stream Proxy] ➔ [Audit Log Logged]
```

---

## 5. Telegram Private Channel Setup Guide

Follow these steps to configure your private evidence channel:

1. **Create a Telegram Bot**:
   - Open Telegram and search for `@BotFather`.
   - Send `/newbot` and follow the prompts to choose a bot name and username (e.g. `nesha_report_bd_bot`).
   - Copy the generated **Bot Token** (e.g. `7123456789:ABCdefGhIjkLmNoPqRsTuVwXyZ`).

2. **Create a Private Telegram Channel**:
   - In Telegram, create a **New Channel**.
   - Set the channel type to **Private Channel** (do NOT create a public username or public link).

3. **Add Bot as Administrator**:
   - Open your private channel's settings ➔ **Administrators** ➔ **Add Administrator**.
   - Search for your bot username and add it.
   - Grant the bot permission to **Post Messages** (and edit/delete messages).

4. **Obtain the Channel ID**:
   - Forward a message from your private channel to `@userinfobot` or `@JsonDumpBot`, or use the Telegram Bot API `getUpdates` endpoint.
   - Private channel IDs typically start with `-100` (e.g. `-1001928374650`).

5. **Configure Environment Variables**:
   In your root `.env` or `backend/.env`:
   ```bash
   TELEGRAM_BOT_TOKEN="your_bot_token_here"
   TELEGRAM_CHANNEL_ID="-1001928374650"
   MAX_EVIDENCE_FILE_SIZE_MB=20
   ```

6. **Verify Storage**:
   - Submit a report with photo evidence in the application.
   - The file will post into your private channel with a confidential caption containing the Report ID.
   - Public users cannot access or view the file.
   - If credentials are not yet configured, the system gracefully operates in fallback mode without crashing.

---

## 6. Firebase Firestore & Security Rules

### Firestore Schema Blueprint (`firebase-blueprint.json`):
- `users`: Citizen profiles
- `policeUsers`: Authorized officers tied to a specific `assignedThanaId`
- `admins`: Super Admin IDs
- `reports`: Confidential reports with `assignedThanaId`
- `reportedPersons`: Suspect profiles (Strictly accessible by assigned Thana officers & Super Admin only)
- `evidence`: Telegram message metadata references
- `auditLogs`: Append-only immutable compliance records
- `notifications`: Thana-specific alerts
- `districts`, `upazilas`, `thanas`, `unions`: Public administrative jurisdictions

### Security Rules (`firestore.rules`):
- Default Deny catch-all (`match /{document=**} { allow read, write: if false; }`)
- Relational Thana check:
  ```javascript
  function isAssignedPolice(thanaId) {
    return isPolice() && getPoliceDoc().assignedThanaId == thanaId;
  }
  ```
- Public users can only read their own reports:
  ```javascript
  existing().reporterId == request.auth.uid
  ```
- Zero "allow read, write: if true" blanket access anywhere in the system.

---

## 7. Environment Variables (`.env.example`)

```env
# Server
PORT=3000
NODE_ENV=development

# Telegram Private Channel Evidence Storage (Backend only)
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHANNEL_ID=-1001234567890
MAX_EVIDENCE_FILE_SIZE_MB=20

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

---

## 8. Installation & Development

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
cp .env.example .env

# 3. Start fullstack server (Express + Vite)
npm run dev

# 4. Production build
npm run build
npm run start
```

---

## 9. Demo Accounts for Immediate Testing

| Role | Email | Password | Details |
|---|---|---|---|
| **Public Citizen** | `citizen@example.com` | `citizen123` | Tanvir Ahmed (Reports: REP-2026-DH-101) |
| **Gulshan Thana Police** | `police.gulshan@police.gov.bd` | `police123` | SI Rafiqul Islam (Thana ID: `thana_gulshan`) |
| **Kotwali Police (CTG)** | `police.kotwali@police.gov.bd` | `police123` | Inspector Mahbub Alam (Thana ID: `thana_kotwali_ctg`) |
| **Super Admin** | `admin@neshareportbd.gov.bd` | `admin123` | Central Narcotics Monitoring & Command |

*A 1-click Demo Role Switcher is also embedded in the top navigation bar for rapid assessment.*

---

## 10. National Helplines in Bangladesh

- **National Emergency Service**: `999` (Police, Fire, Ambulance - 24/7 Free)
- **Department of Narcotics Control (DNC)**: `16124`
- **Central Addiction Treatment Hospital (Tejgaon, Dhaka)**: `02-8333555`
