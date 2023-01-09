function test_dataSaver () {
  const raw = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1-ppUWzjv3eXkBa5a24e1TxF-_8n10pCrVoMjZvaKYJ0/edit#gid=2053317521')
  data = raw.getSheetByName("Appointments By Booking Date").getRange(1, 1, 723, 10).getValues()
  dataSaver(data, "01/06/2023", 'RecallSuccess-MD')
}

function dataSaver(data, date, doc_name) {
  const storage = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Storage")
  const publicGDriveFolder = PUBLIC_GDRIVE_FOLDER
  const key = `${date}/${doc_name}`
  const row = searchForCopyData(key, storage)
  const sheet = createReportBlank(doc_name)
  moveToPublicFolder(sheet, publicGDriveFolder)
  const url = sheet.getUrl()
  const formated_data = dataToRangeFormat(data)
  pasteDataToCopy(sheet.getSheetByName("Data"), formated_data)

  storage.getRange(row, 1, 1, 3).setValues([[
    date,
    doc_name,
    url
  ]])
  return url
}

function moveToPublicFolder(doc, dir) {
  var file = DriveApp.getFileById(doc.getId());
  var folder = DriveApp.getFolderById(dir);
  file.moveTo(folder);
  return true
}

function createReportBlank(name) {
  const doc = SpreadsheetApp.create(name);
  doc.getSheets()[0].setName("Data");
  return doc
}

function pasteDataToCopy(sheet, data) {
  let cols_len = data[0].length
  let rows_len = data.length
  sheet.getRange(1, 1, rows_len, cols_len).setValues(data)
}

function dataToRangeFormat(data) {
  let formated = []
  let length = 1
  data.forEach(row => {
    if(row.length > length) {
      length = row.length
    }
  })
  data.forEach(row => {
    let formated_row = []
    for(i = 0; i < length; i++) {
      if (row[i] != undefined) {
        formated_row.push(row[i])
      } else {
        formated_row.push([])
      }
    }
    formated.push(formated_row)
  })
  return formated
}

function searchForCopyData(key, sheet) {
  let row = sheet.getLastRow() + 1
  let data = sheet.getRange(1,1,row,2).getValues()
  let keys = data.map(row => `${transformDate(row[0]).string}/${row[1]}`)
  if(keys.indexOf(key) != -1) {
    row = keys.indexOf(key) + 1
  }
  return row
}
