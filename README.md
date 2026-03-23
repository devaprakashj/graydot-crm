# GrayDot CRM - Lead Management System

A complete end-to-end Lead Management CRM built with React, Google Apps Script, and Google Sheets.

## Features
- **OTP-Based Authentication**: Secure login via email OTP.
- **Role-Based Workflow**: Admin, Lead Gen, Sales, Manager, Developer, and Tester roles.
- **Automated Distribution**: Round-robin lead assignment to sales team.
- **Status-Driven Transitions**: Automatic moving of leads through the production pipeline.
- **Activity Logging**: Full audit trail of every action.
- **Premium UI**: Modern glassmorphism design with responsive dashboards.

## Setup Instructions

### 1. Database Setup (Google Sheets)
1. Create a new Google Sheet.
2. Create 5 tabs/sheets exactly named:
   - `USERS`
   - `OTP`
   - `LEADS`
   - `PROJECTS`
   - `ACTIVITY LOG`
3. Add headers to the sheets (optional but recommended for readability):
   - **USERS**: `User ID`, `Name`, `Email`, `Role`, `Status`, `Created By`
   - **OTP**: `Email`, `OTP`, `Expiry Time`
   - **LEADS**: `Lead ID`, `Client Name`, `Phone`, `Source`, `Lead Owner`, `Sales Owner`, `Status`, `Manager Status`, `Developer`, `Tester`, `Final Status`, `Created Date`
   - **PROJECTS**: `Project ID`, `Lead ID`, `Developer`, `Status`, `Deadline`, `Tester Status`
   - **ACTIVITY LOG**: `Time`, `Action`, `User`, `Lead ID`

### 2. Backend Setup (Google Apps Script)
1. In your Google Sheet, go to **Extensions** -> **Apps Script**.
2. Copy the content of `backend/gas_code.gs` from this project and paste it into the script editor.
3. Click **Deploy** -> **New Deployment**.
4. Select **Web App**.
5. **Execute as**: Me.
6. **Who has access**: Anyone.
7. Click **Deploy** and copy the **Web App URL**.

### 3. Initial Admin User
1. Manually add your email to the `USERS` sheet to login for the first time:
   - User ID: `U-ADMIN`
   - Name: `Admin`
   - Email: `your-email@example.com`
   - Role: `Admin`
   - Status: `Active`

### 4. Frontend Configuration
1. Open `src/config.ts`.
2. Replace `YOUR_APPS_SCRIPT_WEB_APP_URL_HERE` with the URL you copied in Step 2.

### 5. Run the App
```bash
npm install
npm run dev
```

## Workflow Guide
1. **Lead Team**: Adds a new lead. System assigns it to a Sales member.
2. **Sales Team**: Contacts the lead. Marks as "Interested".
3. **Manager**: Receives "Interested" leads. Approves and assigns a Developer + Deadline.
4. **Developer**: Receives the project. Works on it and marks as "Completed".
5. **Tester**: Performs QA. Marks "Pass" or "Fail".
6. **Final Step**: If Pass, lead status moves to "Completed" for delivery.

---
Built with ❤️ for GrayDot Team.
