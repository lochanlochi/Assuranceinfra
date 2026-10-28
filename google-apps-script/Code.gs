// Receives enquiries from the website and adds each one as a row in this sheet.
// Setup steps are in the project README under "Saving leads to Google Sheets".

const HEADERS = [
  "Received at",
  "Name",
  "Phone",
  "Email",
  "Plot location",
  "Detected location",
  "Interested in",
  "Package",
  "Message",
];

function doPost(e) {
  const secret = PropertiesService.getScriptProperties().getProperty("SECRET");
  let data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return reply({ ok: false, error: "bad json" });
  }
  if (!secret || data.secret !== secret) {
    return reply({ ok: false, error: "unauthorised" });
  }
  if (!Array.isArray(data.row) || data.row.length !== HEADERS.length) {
    return reply({ ok: false, error: "bad row" });
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Leads") ||
      SpreadsheetApp.getActiveSpreadsheet().insertSheet("Leads");
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    }
    const row = data.row.map(String);
    // Show the time in the sheet's own timezone instead of UTC.
    row[0] = Utilities.formatDate(new Date(row[0]), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm");
    // Keep phone numbers as text so Sheets doesn't drop the leading + or 0.
    if (row[2] && row[2][0] !== "'") row[2] = "'" + row[2];
    sheet.appendRow(row);
  } finally {
    lock.releaseLock();
  }
  return reply({ ok: true });
}

function reply(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
