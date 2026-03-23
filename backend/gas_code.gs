const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

function doGet(e) {
  return handleGet(e);
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    const email = data.requesterEmail || data.userEmail || data.adminEmail || data.managerEmail || data.leadOwner || data.developer;
    if (action !== 'sendOTP' && action !== 'verifyOTP' && email && isUserDisabled(email)) {
      return createResponse({ success: false, message: 'Account disabled. Please contact admin.' });
    }

    switch (action) {
      case 'sendOTP': return sendOTP(data.email);
      case 'verifyOTP': return verifyOTP(data.email, data.otp);
      case 'addUser': return addUser(data);
      case 'updateUser': return updateUser(data);
      case 'updateUserStatus': return updateUserStatus(data);
      case 'addLead': return addLead(data);
      case 'updateLeadStatus': return updateLeadStatus(data);
      case 'managerAction': return managerAction(data);
      case 'completeProject': return completeProject(data);
      case 'testerAction': return testerAction(data);
      case 'finalManagerApproval': return finalManagerApproval(data);
      case 'deliverProject': return deliverProject(data);
      case 'requestMoreInfo': return requestMoreInfo(data);
      case 'resolveInfoRequest': return resolveInfoRequest(data);
      case 'updateSettings': return updateSettings(data);
      case 'reassignWork': return reassignWork(data);
      case 'getDailyTracker': return getDailyTracker(data);
      case 'updateDailyTarget': return updateDailyTarget(data);
      default: throw new Error('Invalid action');
    }
  } catch (error) {
    return createResponse({ success: false, message: error.toString() });
  }
}

function handleGet(e) {
  try {
    const action = e.parameter.action;
    const role = e.parameter.role;
    const email = e.parameter.email;

    if (email && isUserDisabled(email)) {
      return createResponse({ success: false, message: 'Account disabled. Please contact admin.' });
    }

    switch (action) {
      case 'getLeads': return getLeads(role, email);
      case 'getUsers': return getUsers();
      case 'getProjects': return getProjects(role, email);
      case 'getSettings': return getSettings();
      case 'getOrphanedWork': return getOrphanedWork();
      case 'getActivityLogs': return getActivityLogs();
      case 'getFinanceStats': return getFinanceStats();
      case 'getTeamPerformance': return getTeamPerformance();
      case 'format': return createResponse({ success: true, message: formatSheets() });
      default: throw new Error('Invalid action');
    }
  } catch (error) {
    return createResponse({ success: false, message: error.toString() });
  }
}

function formatSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  var sheetConfigs = {
    "USERS": ["User ID", "Name", "Email", "Role", "Status"],
    "SETTINGS": ["CompanyName", "Address", "Phone", "Email", "BankName", "AccNo", "IFSC", "Terms"],
    "OTP": ["Email", "OTP", "Timestamp"],
    "LEADS": ["Lead ID", "Client", "Contact", "Source", "Requirement", "Price", "Timeline", "AssignedTo", "Lead By", "Sales By", "Status", "ManagerStatus", "Developer", "Deadline", "ProjectStatus", "Created"],
    "PROJECTS": ["Project ID", "Lead ID", "Developer", "WorkflowStatus", "Deadline", "StepResult", "QA_Log", "Notes", "TestCases", "DeliverableLink", "FinalNote"],
    "ACTIVITY LOG": ["Timestamp", "User", "Action", "Details"]
  };

  Object.keys(sheetConfigs).forEach(function(sheetName) {
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) return;
    
    var headers = sheetConfigs[sheetName];
    var firstRow = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
    
    // Check if headers match or if Row 1 is data
    var isHeaderMissing = firstRow[0] !== headers[0];
    
    if (isHeaderMissing) {
      sheet.insertRowBefore(1);
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }
    
    var lastRow = sheet.getLastRow();
    var lastCol = headers.length;
    var range = sheet.getRange(1, 1, lastRow, lastCol);
    
    // styling
    sheet.getRange(1, 1, 1, lastCol)
      .setFontWeight("bold")
      .setBackground("#1E293B")
      .setFontColor("#FFFFFF")
      .setHorizontalAlignment("center")
      .setVerticalAlignment("middle");
      
    sheet.setFrozenRows(1);
    
    for (var i = 1; i <= lastCol; i++) {
        sheet.autoResizeColumn(i);
        var width = sheet.getColumnWidth(i);
        if (width > 300) sheet.setColumnWidth(i, 300);
    }
    
    range.getBandings().forEach(b => b.remove());
    if (lastRow > 1) range.applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, true, false);
  });
  
  return "Success: Headers restored and alignment fixed for all sheets!";
}

// ------------------- Helper Functions -------------------

function createResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

const SHEET_HEADERS = {
  'USERS': ['ID', 'Name', 'Email', 'Role', 'Status', 'CreatedBy'],
  'OTP': ['Email', 'Otp', 'Expiry'],
  'LEADS': ['ID', 'Name', 'Phone', 'Source', 'Requirement', 'Budget', 'Timeline', 'SalesStatus', 'LeadOwner', 'SalesOwner', 'CreatedDate', 'MgrStatus', 'Dev', 'ProjectStatus', 'FinalStatus'],
  'PROJECTS': ['Project ID', 'Lead ID', 'Developer', 'Status', 'Deadline', 'Tester Status', 'Created Date', 'Repo Link', 'Live Link', 'Tester Feedback'],
  'ACTIVITY LOG': ['Timestamp', 'Action', 'User', 'Details'],
  'SETTINGS': ['CompanyName', 'Address', 'Phone', 'Email', 'BankName', 'AccNo', 'IFSC', 'Terms']
};

function getSheet(name) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    if (SHEET_HEADERS[name]) {
      sheet.appendRow(SHEET_HEADERS[name]);
      sheet.getRange(1, 1, 1, SHEET_HEADERS[name].length).setFontWeight("bold").setBackground("#f3f3f3");
    }
  }
  return sheet;
}

function generateId(prefix) {
  return prefix + Math.floor(100000 + Math.random() * 900000);
}

function isUserDisabled(email) {
  if (!email) return false;
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('USERS');
  if (!sheet) return false;
  const vals = sheet.getDataRange().getValues();
  const userRow = vals.find(r => r[2].toString().toLowerCase() === email.toString().toLowerCase());
  return userRow && userRow[4] === 'Disabled';
}

function logActivity(userEmail, action, leadId = '') {
  const sheet = getSheet('ACTIVITY LOG');
  sheet.appendRow([new Date(), action, userEmail, leadId]);
}

function sendEmail(to, subject, title, body, showProgress = false) {
  try {
    const htmlBody = getEmailTemplate(title, body, showProgress);
    MailApp.sendEmail({ to: to, subject: subject, htmlBody: htmlBody });
  } catch (e) {
    Logger.log("Email failed: " + e.toString());
  }
}

function getEmailTemplate(title, content, showProgress = false) {
  const brandColor = "#1e3a8a"; // Navy Blue from GrayDot
  const accentColor = "#2563eb";
  
  // Progress bar for OTP only
  const progressHtml = showProgress ? `
    <div style="margin: 20px 0; background: #f1f5f9; border-radius: 10px; height: 8px; overflow: hidden; border: 1px solid #e2e8f0;">
      <div style="background: #ef4444; width: 80%; height: 100%; border-radius: 10px;"></div>
    </div>
    <p style="color: #ef4444; font-size: 12px; margin-top: -10px; font-weight: 600;">OTP expires in 5 minutes</p>
  ` : '';

  return `
    <div style="background-color: #f1f5f9; padding: 40px 10px; font-family: 'Inter', -apple-system, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
        
        <!-- Header Section -->
        <div style="background: linear-gradient(135deg, ${brandColor} 0%, ${accentColor} 100%); padding: 50px 20px; text-align: center;">
          <div style="margin-bottom: 20px;">
            <div style="display: inline-block; padding: 12px; border-radius: 12px; background: rgba(255,255,255,0.08); box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
               <img src="https://lh3.googleusercontent.com/d/1IgQtMjSHCJjLEJnWaF-cYmBxCp9KwOm8" 
                    alt="GrayDot Logo" 
                    style="width: 140px; height: auto; display: block; filter: brightness(1.2);" />
            </div>
          </div>
          <div style="height: 3px; width: 60px; background: #60a5fa; margin: 0 auto 15px auto; border-radius: 2px;"></div>
          <p style="color: #bfdbfe; font-size: 13px; text-transform: uppercase; letter-spacing: 3px; font-weight: 600; font-family: 'Inter', sans-serif; margin: 0;">Internal Business Ecosystem</p>
        </div>

        <!-- Content Section -->
        <div style="padding: 45px 35px;">
          <h2 style="color: #0f172a; font-size: 24px; font-weight: 700; margin: 0 0 20px 0; letter-spacing: -0.5px;">${title}</h2>
          
          <div style="color: #475569; line-height: 1.8; font-size: 16px;">
            ${content}
          </div>

          ${progressHtml}

          <div style="margin-top: 40px; text-align: center;">
            <a href="#" style="background-color: ${accentColor}; color: white; padding: 16px 32px; border-radius: 12px; font-weight: 700; text-decoration: none; display: inline-block; font-size: 14px; box-shadow: 0 10px 15px -3px rgba(37,99,235,0.3);">
              Enter Dashboard Now
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 30px; border-top: 1px solid #f1f5f9; text-align: center;">
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} GrayDot CRM. Built for Internal Productivity.</p>
          <div style="margin-top: 10px;">
            <a href="#" style="color: #64748b; font-size: 11px; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
            <a href="#" style="color: #64748b; font-size: 11px; text-decoration: none; margin: 0 10px;">Terms of Service</a>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ------------------- Auth -------------------

function sendOTP(email) {
  const userSheet = getSheet('USERS');
  const users = userSheet.getDataRange().getValues();
  let user = users.find(r => r[2] === email);

  if (!user) return createResponse({ success: false, message: 'User not found.' });
  if (user[4] === 'Disabled') return createResponse({ success: false, message: 'ACCOUNT_DISABLED: Your account has been disabled by the administrator. Please contact the management team for assistance.' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = new Date().getTime() + (5 * 60 * 1000);
  getSheet('OTP').appendRow([email, otp, expiry]);

  sendEmail(email, "CRM Login OTP", "Login Verification", "Your login OTP is: <br><br><b style='font-size: 24px; color: #2563eb; letter-spacing: 2px;'>" + otp + "</b><br><br>This OTP is valid for 5 minutes.", true);
  return createResponse({ success: true, message: 'OTP sent.' });
}

function verifyOTP(email, otp) {
  const values = getSheet('OTP').getDataRange().getValues();
  const now = new Date().getTime();
  const record = values.reverse().find(r => r[0] === email && r[1].toString() === otp.toString());

  if (record && now <= record[2]) {
    const userRow = getSheet('USERS').getDataRange().getValues().find(r => r[2] === email);
    const userData = { userId: userRow[0], name: userRow[1], email: userRow[2], role: userRow[3], status: userRow[4] };
    logActivity(email, 'Login Success');
    return createResponse({ success: true, userData: userData });
  }
  return createResponse({ success: false, message: 'Invalid or expired OTP.' });
}

// ------------------- STEP 1: LEAD GENERATION -------------------

function addLead(data) {
  const sheet = getSheet('LEADS');
  const leadId = generateId('L-');
  const salesEmail = getNextSalesPerson();

  // Columns: Lead ID[0], Name[1], Phone[2], Source[3], Req[4], Budget[5], Timeline[6], Notes[7], Lead Owner[8], Sales Owner[9], Status[10], Mgr Status[11], Dev[12], Tester[13], Final Status[14], Date[15]
  sheet.appendRow([
    leadId, data.clientName, data.phone, data.source, data.requirement, data.budget, data.timeline, data.notes,
    data.leadOwner, salesEmail, 'New', 'None', '', '', 'Draft', new Date()
  ]);

  logActivity(data.leadOwner, 'Created Lead', leadId);
  sendEmail(salesEmail, "New Lead Assigned: " + leadId, "Lead Assignment", "You have a new lead. Client: <b>" + data.clientName + "</b>");
  
  return createResponse({ success: true, leadId: leadId });
}

function getNextSalesPerson() {
  const users = getSheet('USERS').getDataRange().getValues();
  const sales = users.filter(r => r[3] === 'Sales' && r[4] === 'Active');
  if (sales.length === 0) return 'Unassigned';

  const leads = getSheet('LEADS').getDataRange().getValues();
  const dist = {};
  sales.forEach(s => dist[s[2]] = 0);
  leads.slice(1).forEach(l => { if(dist.hasOwnProperty(l[9])) dist[l[9]]++; });

  let min = Infinity, next = sales[0][2];
  for (let em in dist) { if(dist[em] < min) { min = dist[em]; next = em; } }
  return next;
}

// ------------------- STEP 2: SALES TEAM -------------------

function updateLeadStatus(data) {
  const sheet = getSheet('LEADS');
  const values = sheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (values[i][0] === data.leadId) {
      sheet.getRange(i + 1, 11).setValue(data.status); // Column 11: Status
      
      if (data.status === 'Interested') {
        sheet.getRange(i + 1, 12).setValue('Pending'); // Column 12: Manager Status
        if (data.price) {
          sheet.getRange(i + 1, 6).setValue(data.price); // Column 6: Budget/Price
        }
        // Notify Managers
        const managers = getSheet('USERS').getDataRange().getValues().filter(r => r[3] === 'Manager');
        managers.forEach(m => sendEmail(m[2], "Lead Approval Required", "Approval Requested", "Lead <b>" + data.leadId + "</b> marked as Interested. Price: <b>₹" + data.price + "</b>"));
      }
      
      logActivity(data.userEmail, 'Updated lead status to ' + data.status, data.leadId);
      return createResponse({ success: true });
    }
  }
  return createResponse({ success: false });
}

// ------------------- STEP 3: MANAGER APPROVAL -------------------

function managerAction(data) {
  const sheet = getSheet('LEADS');
  const vals = sheet.getDataRange().getValues();
  const leadId = data.leadId.toString().trim();
  
  for (let i = 1; i < vals.length; i++) {
    const sheetLeadId = vals[i][0].toString().trim();
    if (sheetLeadId === leadId) {
      sheet.getRange(i + 1, 12).setValue(data.managerAction); // Column 12: Mgr Status
      
      if (data.managerAction === 'Approved') {
        const devEmail = data.developer.toString().trim();
        sheet.getRange(i + 1, 13).setValue(devEmail); // Assign Dev (Column 13)
        sheet.getRange(i + 1, 15).setValue('In Progress'); // Final Status (Column 15)
        
        // Create Project - Ensure PROJECTS sheet exists
        let pSheet = getSheet('PROJECTS');
        
        const pId = generateId('P-');
        pSheet.appendRow([pId, leadId, devEmail, 'In Progress', data.deadline, 'Pending', new Date()]);
        
        sendEmail(devEmail, "New Project Assigned", "Project Assignment", "Project for Lead <b>" + leadId + "</b> assigned. Deadline: <b>" + data.deadline + "</b>");
        logActivity(data.managerEmail, 'Approved Lead & Created Project', leadId);
      } else {
        // Rejected - Back to Sales
        sheet.getRange(i + 1, 11).setValue('Contacted'); 
        sendEmail(vals[i][9], "Lead Rejected by Manager", "Lead Update", "Lead <b>" + leadId + "</b> was rejected.");
        logActivity(data.managerEmail, 'Rejected Lead', leadId);
      }
      
      return createResponse({ success: true });
    }
  }
  return createResponse({ success: false, message: 'Lead ID not found' });
}

// ------------------- Settings Functions -------------------

function getSettings() {
  const sheet = getSheet('SETTINGS');
  const vals = sheet.getDataRange().getValues();
  if (vals.length < 2) {
    // Initial defaults if sheet is empty or only has headers
    return createResponse({ 
      success: true, 
      data: {
        companyName: 'GrayDot',
        address: '123 Innovation Hub, Tech City, IN 600001',
        phone: '+91 98765 43210',
        email: 'sales@graydot.com',
        bankName: 'HDFC Bank',
        accNo: '1234567890',
        ifsc: 'HDFC0001234',
        terms: 'Please include invoice number in payment notes. This is a computer generated invoice.'
      }
    });
  }
  const r = vals[1]; // Assuming settings are in the second row (after header)
  return createResponse({
    success: true,
    data: {
      companyName: r[0], address: r[1], phone: r[2], email: r[3],
      bankName: r[4], accNo: r[5], ifsc: r[6], terms: r[7]
    }
  });
}

function updateSettings(data) {
  const sheet = getSheet('SETTINGS');
  sheet.clearContents(); // Clear existing data
  sheet.appendRow(['CompanyName', 'Address', 'Phone', 'Email', 'BankName', 'AccNo', 'IFSC', 'Terms']); // Re-add header
  sheet.appendRow([
    data.companyName, data.address, data.phone, data.email,
    data.bankName, data.accNo, data.ifsc, data.terms
  ]);
  return createResponse({ success: true });
}

// ------------------- STEP 4: DEVELOPER -------------------

function requestMoreInfo(data) {
  const pSheet = getSheet('PROJECTS');
  const lSheet = getSheet('LEADS');
  const lVals = lSheet.getDataRange().getValues();
  const pVals = pSheet.getDataRange().getValues();
  
  // Find project to get Lead ID
  let leadId = '';
  for (let i = 1; i < pVals.length; i++) {
    if (pVals[i][0] === data.projectId) {
      leadId = pVals[i][1];
      pSheet.getRange(i + 1, 4).setValue('Pending More Info');
      break;
    }
  }

  if (leadId) {
    for (let i = 1; i < lVals.length; i++) {
      if (lVals[i][0] === leadId) {
        lSheet.getRange(i + 1, 11).setValue('More Info Req'); // Main status badge
        lSheet.getRange(i + 1, 15).setValue('More Info Required'); // Final status
        const salesEmail = lVals[i][9];
        sendEmail(salesEmail, "Developer Requested More Info", "Action Required", "Developer needs more info for Lead <b>" + leadId + "</b>. <br><br><b>Note:</b> " + (data.note || 'None'));
        break;
      }
    }
  }
  
  logActivity(data.userEmail, 'Requested More Info', leadId || data.projectId);
  return createResponse({ success: true });
}

function resolveInfoRequest(data) {
  const lSheet = getSheet('LEADS');
  const pSheet = getSheet('PROJECTS');
  const lVals = lSheet.getDataRange().getValues();
  const pVals = pSheet.getDataRange().getValues();

  for (let i = 1; i < lVals.length; i++) {
    if (lVals[i][0] === data.leadId) {
      lSheet.getRange(i + 1, 11).setValue('Interested');
      lSheet.getRange(i + 1, 15).setValue('In Progress');
      const devEmail = lVals[i][12];
      
      // Update Project Status
      for (let j = 1; j < pVals.length; j++) {
        if (pVals[j][1] === data.leadId) {
          pSheet.getRange(j + 1, 4).setValue('In Progress');
          break;
        }
      }
      
      sendEmail(devEmail, "Info Updated: Project In Progress", "Project Update", "Sales team updated info for Lead <b>" + data.leadId + "</b>. Please continue development.");
      break;
    }
  }
  
  logActivity(data.userEmail, 'Resolved More Info Request', data.leadId);
  return createResponse({ success: true });
}

function completeProject(data) {
  const pSheet = getSheet('PROJECTS');
  const pVals = pSheet.getDataRange().getValues();
  for (let i = 1; i < pVals.length; i++) {
    if (pVals[i][0] === data.projectId) {
      pSheet.getRange(i + 1, 4).setValue('Completed'); // Project Status
      pSheet.getRange(i + 1, 6).setValue('Testing'); // Tester Status
      pSheet.getRange(i + 1, 8).setValue(data.repoLink); // Repo Link (Col 8)
      pSheet.getRange(i + 1, 9).setValue(data.liveLink || ''); // Live Link (Col 9)
      
      const leadId = pVals[i][1];
      updateLeadFinalStatus(leadId, 'In QA Testing');
      
      // Notify Testers
      const testers = getSheet('USERS').getDataRange().getValues().filter(r => r[3] === 'Tester');
      testers.forEach(t => sendEmail(t[2], "Project Ready for Testing", "QA Audit Required", "Project <b>" + data.projectId + "</b> completed by developer. <br><br><b>Repo:</b> " + data.repoLink));
      
      logActivity(data.userEmail, 'Project Completed and Submitted for QA', leadId);
      return createResponse({ success: true });
    }
  }
}

// ------------------- STEP 5: TESTING -------------------

function testerAction(data) {
  const pSheet = getSheet('PROJECTS');
  const pVals = pSheet.getDataRange().getValues();
  for (let i = 1; i < pVals.length; i++) {
    if (pVals[i][0] === data.projectId) {
      pSheet.getRange(i + 1, 6).setValue(data.result); // Pass / Fail
      const leadId = pVals[i][1];
      const devEmail = pVals[i][2];
      
      if (data.result === 'Pass') {
        pSheet.getRange(i + 1, 4).setValue('Verified');
        pSheet.getRange(i + 1, 10).setValue('PASSED: Project ready for delivery');
        updateLeadFinalStatus(leadId, 'Awaiting Final Approval');
        // Notify Manager
        const managers = getSheet('USERS').getDataRange().getValues().filter(r => r[3] === 'Manager');
        managers.forEach(m => sendEmail(m[2], "Project Passed QA", "Final Sign-off Required", "Project <b>" + data.projectId + "</b> ready for final approval."));
      } else {
        pSheet.getRange(i + 1, 4).setValue('In Progress'); // Reset status back to Dev
        pSheet.getRange(i + 1, 10).setValue(data.feedback); // Feedback (Col 10)
        updateLeadFinalStatus(leadId, 'QA Failed - Revision');
        sendEmail(devEmail, "QA Failed - Action Required", "Revision Required", "Project <b>" + data.projectId + "</b> failed testing. <br><br><b>Feedback:</b> " + data.feedback);
      }
      
      logActivity(data.userEmail, 'Testing Result: ' + data.result + ' for ' + data.projectId, leadId);
      return createResponse({ success: true });
    }
  }
}

// ------------------- STEP 6: FINAL MANAGER APPROVAL -------------------

function finalManagerApproval(data) {
  const sheet = getSheet('LEADS');
  const vals = sheet.getDataRange().getValues();
  for (let i = 1; i < vals.length; i++) {
    if (vals[i][0] === data.leadId) {
      sheet.getRange(i + 1, 15).setValue('Approved for Delivery');
      sendEmail(vals[i][9], "Project Approved for Delivery", "Ready for Delivery", "Client <b>" + vals[i][1] + "</b>'s project is ready to deliver.");
      logActivity(data.managerEmail, 'Final Approval Given', data.leadId);
      return createResponse({ success: true });
    }
  }
}

// ------------------- STEP 7: SALES DELIVERY -------------------

function deliverProject(data) {
  const sheet = getSheet('LEADS');
  const vals = sheet.getDataRange().getValues();
  for (let i = 1; i < vals.length; i++) {
    if (vals[i][0] === data.leadId) {
      sheet.getRange(i + 1, 15).setValue('Delivered');
      logActivity(data.userEmail, 'Project Delivered and Payment Collected', data.leadId);
      return createResponse({ success: true });
    }
  }
}

// ------------------- Get Functions (Filtered) -------------------

function getLeads(role, email) {
  const vals = getSheet('LEADS').getDataRange().getValues().slice(1);
  const searchEmail = (email || '').toString().trim().toLowerCase();
  let res = [];
  
  if (role === 'Admin' || role === 'Manager') {
    res = vals;
  } else if (role === 'Lead') {
    res = vals.filter(r => r[8].toString().trim().toLowerCase() === searchEmail); // LeadOwner: Index 8
  } else if (role === 'Sales') {
    res = vals.filter(r => r[9].toString().trim().toLowerCase() === searchEmail || r[9] === 'Unassigned'); // SalesOwner: Index 9
  } else if (role === 'Manager') {
    // MgrStatus: Index 11, FinalStatus: Index 14
    res = vals.filter(r => (r[11] === 'Pending' || r[14] === 'Awaiting Final Approval' || r[14] === 'In QA Testing'));
  }
  return createResponse({ success: true, data: res });
}

function getProjects(role, email) {
  const pSheet = getSheet('PROJECTS');
  if (!pSheet) return createResponse({ success: true, data: [] });
  
  const pVals = pSheet.getDataRange().getValues().slice(1);
  const lVals = getSheet('LEADS').getDataRange().getValues().slice(1);
  const searchEmail = email.toString().trim().toLowerCase();
  
  // Create a map for quick lead lookup
  const leadMap = {};
  lVals.forEach(l => {
    leadMap[l[0]] = { clientName: l[1], requirement: l[4], budget: l[5] };
  });

  let projects = pVals.map(p => {
    const leadInfo = leadMap[p[1]] || { clientName: 'Unknown', requirement: 'Not Available', budget: '-' };
    // Only include budget for Admin and Manager
    const budgetVal = (role === 'Admin' || role === 'Manager') ? leadInfo.budget : '-';
    return [...p, leadInfo.clientName, leadInfo.requirement, budgetVal];
  });

  if (role === 'Admin') return createResponse({ success: true, data: projects });
  
  if (role === 'Developer') {
    return createResponse({ 
      success: true, 
      data: projects.filter(p => p[2].toString().trim().toLowerCase() === searchEmail) 
    });
  }
  
  if (role === 'Tester') {
    return createResponse({ 
      success: true, 
      data: projects.filter(p => 
        (p[3]?.toString().trim() === 'Completed' || p[5]?.toString().trim() === 'Testing' || p[5]?.toString().trim() === 'Fail') && 
        p[3]?.toString().trim() !== 'Verified'
      ) 
    });
  }
  
  return createResponse({ success: true, data: [] });
}

function getUsers() {
  return createResponse({ success: true, data: getSheet('USERS').getDataRange().getValues().slice(1) });
}

function getActivityLogs() {
  return createResponse({ success: true, data: getSheet('ACTIVITY LOG').getDataRange().getValues().slice(1).reverse() });
}

function updateLeadFinalStatus(leadId, status) {
  const sheet = getSheet('LEADS');
  const vals = sheet.getDataRange().getValues();
  for (let i = 1; i < vals.length; i++) {
    if (vals[i][0] === leadId) {
      sheet.getRange(i + 1, 15).setValue(status); // Column 15: Final Status
      break;
    }
  }
}

function addUser(data) {
  if (!data.email || !data.name || !data.role) {
    return createResponse({ success: false, message: 'Missing required fields: Name, Email, and Role are mandatory.' });
  }

  const sheet = getSheet('USERS');
  const values = sheet.getDataRange().getValues();
  
  // Check Duplicate Email
  const existing = values.find(r => r[2].toString().toLowerCase() === data.email.toLowerCase());
  if (existing) {
    return createResponse({ success: false, message: 'A user with this email already exists!' });
  }

  const userId = generateId('U-');
  sheet.appendRow([userId, data.name, data.email, data.role, 'Active', data.createdBy]);
  
  // Role Specific Instructions
  let workflow = '';
  let loginUrl = 'https://script.google.com/macros/s/' + SPREADSHEET_ID + '/exec'; // Placeholder, ideally specific
  
  switch(data.role) {
    case 'Lead': 
      workflow = 'As a <b>Lead Generator</b>, your focus is to fuel our pipelines with high-quality leads. Ensure client requirements are captured accurately.';
      break;
    case 'Sales':
      workflow = 'As <b>Sales Specialist</b>, you are the face of GrayDot. Negotiate effectively, mark leads as interested, and ensure client satisfaction.';
      break;
    case 'Manager':
      workflow = 'As a <b>Project Manager</b>, you oversee the transition from lead to project. You have authority over developer allocation and final delivery.';
      break;
    case 'Developer':
      workflow = 'As a <b>Developer</b>, your mission is execution excellence. Keep your workspace updated and push results for QA testing on time.';
      break;
    case 'Tester':
      workflow = 'As a <b>QA Tester</b>, you are the shield of quality. Audit completions carefully and ensure every project meets our gold standards.';
      break;
    case 'Admin':
      workflow = `
        As an <b>Enterprise Administrator</b>, you have been granted sovereign system rights including:
        <ul>
          <li><b>Team Orchestration:</b> Activate or disable users for security.</li>
          <li><b>Financial Oversight:</b> Manage bank details, invoice terms, and revenue tracking.</li>
          <li><b>Pipeline Integrity:</b> Use the 'Repair & Format' tools to maintain sheet health.</li>
          <li><b>System Audit:</b> Monitor real-time logs for all business activities.</li>
          <li><b>Team Efficiency:</b> Track performance quotas per member.</li>
        </ul>
      `;
      break;
  }

  const welcomeMsg = `
    Hi <b>${data.name}</b>,<br><br>
    Your professional account for <b>GrayDot OS</b> has been activated. You have been assigned the role of <b>${data.role}</b>.<br><br>
    <div style="background: #f8fafc; border-radius: 12px; padding: 20px; border: 1px dashed #cbd5e1; margin-bottom: 25px;">
       <h4 style="margin-top:0; color: #1e3a8a;">Your Core Protocol:</h4>
       ${workflow}
    </div>
    You can log in securely using your registered email and a one-time passcode (OTP). For security, never share your OTP with anyone.<br><br>
    Best Regards,<br>Management Team
  `;
  
  try {
    sendEmail(data.email, "Welcome to GrayDot Team!", "Account Activated", welcomeMsg);
  } catch (e) {
    Logger.log("Welcome email failed: " + e.toString());
  }
  
  return createResponse({ success: true });
}

function updateUser(data) {
  const sheet = getSheet('USERS');
  const values = sheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (values[i][0] == data.userId || values[i][2] == data.email) {
      sheet.getRange(i + 1, 2).setValue(data.name);
      sheet.getRange(i + 1, 4).setValue(data.role);
      return createResponse({ success: true });
    }
  }
  return createResponse({ success: false });
}

function updateUserStatus(data) {
  const sheet = getSheet('USERS');
  const values = sheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (values[i][2] === data.email) {
      sheet.getRange(i + 1, 5).setValue(data.status);
      logActivity(data.adminEmail, 'Changed status of ' + data.email + ' to ' + data.status);
      return createResponse({ success: true });
    }
  }
}

function getOrphanedWork() {
  const users = getSheet('USERS').getDataRange().getValues().slice(1);
  const disabledEmails = users.filter(u => u[4] === 'Disabled').map(u => u[2].toString().toLowerCase());
  
  if (disabledEmails.length === 0) return createResponse({ success: true, data: [] });
  
  const leads = getSheet('LEADS').getDataRange().getValues().slice(1);
  const projects = getSheet('PROJECTS').getDataRange().getValues().slice(1);
  
  let orphaned = [];
  
  // Leads: Index 9 is SalesOwner (Column 10)
  leads.forEach(l => {
    if (disabledEmails.includes(l[9].toString().toLowerCase())) {
      orphaned.push({ id: l[0], type: 'Lead', currentOwner: l[9], client: l[1] });
    }
  });
  
  // Projects: Index 2 is Developer (Column 3)
  projects.forEach(p => {
    if (disabledEmails.includes(p[2].toString().toLowerCase())) {
      orphaned.push({ id: p[0], type: 'Project', currentOwner: p[2], leadId: p[1] });
    }
  });
  
  return createResponse({ success: true, data: orphaned });
}

function reassignWork(data) {
  const { type, id, newOwnerEmail } = data;
  
  if (type === 'Lead') {
    const sheet = getSheet('LEADS');
    const vals = sheet.getDataRange().getValues();
    for (let i = 1; i < vals.length; i++) {
      if (vals[i][0] === id) {
        sheet.getRange(i + 1, 10).setValue(newOwnerEmail); // Column 10: SalesOwner
        logActivity(data.adminEmail, 'Reassigned Lead ' + id + ' to ' + newOwnerEmail);
        return createResponse({ success: true });
      }
    }
  } else if (type === 'Project') {
    const sheet = getSheet('PROJECTS');
    const vals = sheet.getDataRange().getValues();
    for (let i = 1; i < vals.length; i++) {
      if (vals[i][0] === id) {
        sheet.getRange(i + 1, 3).setValue(newOwnerEmail); // Column 3: Developer
        logActivity(data.adminEmail, 'Reassigned Project ' + id + ' to ' + newOwnerEmail);
        return createResponse({ success: true });
      }
    }
  }
  return createResponse({ success: false, message: 'Item not found' });
}

function getActivityLogs() {
  const sheet = getSheet('ACTIVITY LOG');
  const values = sheet.getDataRange().getValues();
  // Reverse to get latest logs first, and take last 100 excluding header
  const logs = values.slice(1).reverse().slice(0, 100);
  return createResponse({ success: true, data: logs });
}

function getFinanceStats() {
  const leads = getSheet('LEADS').getDataRange().getValues().slice(1);
  const projects = getSheet('PROJECTS').getDataRange().getValues().slice(1);
  
  let totalPotential = 0;
  let received = 0;
  let pending = 0;
  
  leads.forEach(l => {
    let price = parseFloat(l[5]) || 0;
    totalPotential += price;
    
    if (l[14] === 'Delivered' || l[14] === 'Completed') {
      received += price;
    } else if (l[11] === 'Approved') {
      pending += price;
    }
  });
  
  return createResponse({ 
    success: true, 
    data: {
      potential: totalPotential,
      received: received,
      pending: pending,
      leadCount: leads.length,
      projectCount: projects.length
    }
  });
}

function getDailyTracker(data) {
  const { email } = data;
  const leads = getSheet('LEADS').getDataRange().getValues().slice(1);
  const settings = getSheet('SETTINGS').getDataRange().getValues();
  
  // Get Target from Settings or default to 10
  let targetRow = settings.find(r => r[0] === 'DailyTarget');
  let dailyTarget = targetRow ? parseInt(targetRow[1]) : 10;
  
  // Count leads created TODAY by this user (email index 8, date created index 15)
  const today = new Date().toDateString();
  const count = leads.filter(l => l[8].toString().toLowerCase() === email.toLowerCase() && l[15] && new Date(l[15]).toDateString() === today).length;
  
  return createResponse({ 
    success: true, 
    data: {
      count: count,
      target: dailyTarget,
      progress: Math.min((count / dailyTarget) * 100, 100)
    }
  });
}

function updateDailyTarget(data) {
  const { newTarget } = data;
  const sheet = getSheet('SETTINGS');
  const values = sheet.getDataRange().getValues();
  let found = false;
  
  for (let i = 0; i < values.length; i++) {
    if (values[i][0] === 'DailyTarget') {
      sheet.getRange(i + 1, 2).setValue(newTarget);
      found = true;
      break;
    }
  }
  
  if (!found) {
    sheet.appendRow(['DailyTarget', newTarget]);
  }
  return createResponse({ success: true });
}

function getTeamPerformance() {
  const users = getSheet('USERS').getDataRange().getValues().slice(1);
  const leads = getSheet('LEADS').getDataRange().getValues().slice(1);
  const projects = getSheet('PROJECTS').getDataRange().getValues().slice(1);
  const settings = getSheet('SETTINGS').getDataRange().getValues();
  
  const dailyTarget = parseInt(settings.find(r => r[0] === 'DailyTarget')?.[1] || "10");
  const today = new Date().toDateString();

  const perfData = users.map(user => {
    const email = user[2].toString().toLowerCase();
    const role = user[3];
    
    let active = 0;
    let completed = 0;
    let todayCount = 0;

    if (role === 'Lead') {
      const userLeads = leads.filter(l => l[8].toString().toLowerCase() === email);
      active = userLeads.filter(l => l[14] !== 'Delivered' && l[10] !== 'Rejected').length;
      completed = userLeads.filter(l => l[14] === 'Delivered').length;
      todayCount = userLeads.filter(l => l[15] && new Date(l[15]).toDateString() === today).length;
    } else if (role === 'Sales') {
      const userLeads = leads.filter(l => l[9].toString().toLowerCase() === email);
      active = userLeads.filter(l => l[10] === 'Contacted' || l[10] === 'New').length;
      completed = userLeads.filter(l => l[10] === 'Interested' || l[10] === 'Rejected').length;
    } else if (role === 'Developer') {
      const userProj = projects.filter(p => p[2].toString().toLowerCase() === email);
      active = userProj.filter(p => p[3] === 'In Progress').length;
      completed = userProj.filter(p => p[3] === 'Completed').length;
    } else if (role === 'Tester') {
       // Tester handles projects where tester email matches column index 13? No, let's assume Tester is global usually or assigned.
       // For now, based on projects handled
       const testerProj = projects.filter(p => p[5] === 'Verified' || p[5] === 'Fail');
       completed = testerProj.length;
    }

    return {
      name: user[1],
      email: email,
      role: role,
      status: user[4],
      activeTasks: active,
      completedTasks: completed,
      todayTarget: role === 'Lead' ? { count: todayCount, target: dailyTarget, progress: (todayCount/dailyTarget)*100 } : null
    };
  });

  return createResponse({ success: true, data: perfData });
}
