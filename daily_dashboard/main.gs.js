function onOpen() {
  SpreadsheetApp.getUi().createMenu("⚙️ Upload Data")
    .addItem("🌄 Upload data: Daily", "importDailyFile")
    .addItem("🛠 Run Tests", "runTests")
    .addToUi()
}

function runTests(e) {
  if (!e) {
    const output = HtmlService.createHtmlOutputFromFile("tests_form")
    SpreadsheetApp.getUi().showModalDialog(output, "Tests")
    return;
  } 
}

function importDailyFile(e, doc_name, date){
  if (!e) {
    const output = HtmlService.createHtmlOutputFromFile("uploading_form_daily")
    output.setWidth(500)
    output.setHeight(500)
    SpreadsheetApp.getUi().showModalDialog(output, "Uploading Form Daily")
    return;
  } 
  let data

  if(e[2].includes('.csv')) {
    const file = Utilities.parseCsv(Utilities.newBlob(...e).getDataAsString());
    data = file
  }
  else {
    const file = Utilities.parseCsv(Utilities.newBlob(e).getDataAsString());
    data = file
  }
  try {
    dataSaver(data, date, doc_name)
  } catch (e) {
    console.log(e)
  }
  let res = processRawDataDaily(data, doc_name, date)
  return {
    data: data,
    id: res.doc_name,
    details: res
  }
}

function processRawDataDaily(data, doc_name, date) {
  let value_objects = false
  switch (doc_name) {
    case 'branchkpisummary':
      value_objects = process_BranchKpiSummary(data, date)
      break

    case 'TillOpticianPerformanceAnalysis':
      value_objects = process_TillOpticianPerformanceAnalysis(data, date)
      break

    case 'AppointmentsByBookingDate':
      value_objects = process_AppointmentsByBookingDate_Adult(data, date)
      break

    default:
      value_objects = []
      break 
  }
  return pasteDailyValues(value_objects, doc_name)
}

// DAILY OBJECT EXAMPLE
// date: "31/12/2022"
// value: "134",
// branch: "Cheadle",
// target_column: "Number of EE Completed"

function pasteDailyValues(value_objects, doc_name) {
  const db_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("DB (DAILY)");
  const last_row = db_sheet.getLastRow()
  let main_selectors = []
    main_selectors.unshift('')
    main_selectors.unshift('')

  const main_selector_values = db_sheet.getRange(2,1,last_row-1,2).getValues()
  main_selector_values.forEach(value => {
    main_selectors.push(
      `${transformDate(new Date(value[0])).string}/${value[1]}`
    )
  })
  
  value_objects.forEach(obj => {
    const column = DAILY_DATABASE_COLUMNS.indexOf(obj.target_column) + 1
    const key = `${obj.date.toString()}/${obj.branch}`
    const row = main_selectors.indexOf(key)
    db_sheet.getRange(row, column).setValue(obj.value)
  })
  return {
    doc_name: doc_name,
    value_objects: value_objects,
    db_name: "DB (DAILY)"
  }
}
