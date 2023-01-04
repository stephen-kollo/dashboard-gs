function onOpen() {
  SpreadsheetApp.getUi().createMenu("Upload")
    .addItem("Upload data: Weekly", "importFile")
    .addItem("Upload data: Daily", "importDailyFile")
    .addItem("Run Tests", "runTests")
    .addToUi()
}

function runTests(e) {
  if (!e) {
    const output = HtmlService.createHtmlOutputFromFile("tests_form")
    SpreadsheetApp.getUi().showModalDialog(output, "Tests")
    return;
  } 
}

function importFile(e, doc_name, period, id_data){
  if (!e) {
    const output = HtmlService.createHtmlOutputFromFile("uploading_form")
    output.setWidth(400)
    output.setHeight(500)
    SpreadsheetApp.getUi().showModalDialog(output, "Uploading Form")
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
  
  let res = processRawData(data, doc_name, period, id_data)
  return {
    data: data,
    id: res.doc_name,
    details: res
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
    case 'TillOpticianPerformanceAnalysis':
      value_objects = process_TillOpticianPerformanceAnalysisData_Daily(data, date)
      break

    case 'salesanalysis':
      value_objects = process_SalesAnalysis(data, date)
      break

    case 'takings':
      value_objects = process_Takings(data, date)
      break

    case 'branchkpisummary':
      value_objects = process_BranchKpiSummary(data, date)
      break

    case 'DiaryNewPatientsBranch':
      value_objects = process_DiaryNewPatientsBranch_Daily(data, date)
      break

    case 'debtors':
      value_objects = process_Debtors(data, date)
      break

    default:
      value_objects = []
      break 
  }
  return pasteDailyValues(value_objects, doc_name)
}

function processRawData(data, doc_name, period, id_data) {
  const weekly_DB_name = "DB (WEEKLY)"
  let value_objects = false

  switch (doc_name) {
    case 'TillOpticianPerformanceAnalysis':
      value_objects = {
        objects: process_TillOpticianPerformanceAnalysisData(data, period),
        db_name: weekly_DB_name
      }
      break

    case 'ProductSalesbyBrand':
      value_objects = {
        objects: process_ProductSalesByBrand(data, period),
        db_name: weekly_DB_name
      }
      break

    case 'AppointmentsByBookingDate':
      value_objects = {
        objects: process_AppointmentsByBookingDate(data, period),
        db_name: weekly_DB_name
      }
      break

    case 'DiaryRecallUnchanged':
      value_objects = {
        objects: process_DairyRecallUnchanged(data, period, id_data),
        db_name: weekly_DB_name
      }
      break
      
    case 'AppTypeByOptom':
      value_objects = {
        objects: process_AppTypeByOptom(data, period),
        db_name: weekly_DB_name
      }
      break

    case 'SchemeAnalysis':
      value_objects = {
        objects: process_SchemeAnalysis(data, period),
        db_name: weekly_DB_name
      }
      break

    case 'PatientTransactions':
      value_objects = {
        objects: process_PatientTransactions(data, period),
        db_name: 'DB (Patient Transactions)'
      }
      break

    case 'DiaryNewPatientsBranch':
      value_objects = {
        objects: process_DiaryNewPatientsBranch_Id(data, period),
        db_name: 'DB (Diary New Patients Branch)'
      }
      if (pasteValues(value_objects.objects, doc_name, value_objects.db_name).doc_name == 'DiaryNewPatientsBranch') {
        value_objects = {
          objects: process_DiaryNewPatientsBranch(data, period),
          db_name: weekly_DB_name
        }
      } else {
        value_objects = []
      }
      break

    case 'WhyUs':
      value_objects = {
        objects: process_WhyUs_Id(data, period),
        db_name: 'DB (Why Us)'
      }
      if (pasteValues(value_objects.objects, doc_name, value_objects.db_name).doc_name == 'WhyUs') {
        value_objects = {
          objects: process_WhyUs(data, period),
          db_name: weekly_DB_name
        }
      } else {
        value_objects = [] 
      }
      break

    default:
      if (doc_name.indexOf('RecallSuccess') != -1) {
        value_objects = {
          objects: process_RecallSuccess(data, period, doc_name.substring(14)),
          db_name: weekly_DB_name
        }
        doc_name = 'RecallSuccess'
      } else {
        value_objects = {
          objects: [],
          db_name: weekly_DB_name
        }
      }
  }

  return pasteValues(value_objects.objects, doc_name, value_objects.db_name)
  
}

function pasteValues(value_objects, doc_name, db_name) {
  if (db_name == 'DB (WEEKLY)') {
    pasteWeeklyValues(value_objects, doc_name)
  } else if (db_name == 'DB (Patient Transactions)') {
    pastePatientTransactionsValues(value_objects, doc_name)
  } else if (db_name == 'DB (Diary New Patients Branch)') {
    pasteDiaryNewPatientsBranchValues(value_objects, doc_name)
  } else if (db_name == 'DB (Why Us)') {
    pasteWhyUsValues(value_objects, doc_name)
  }
  
  if(doc_name == 'RecallSuccess') {
    doc_name = `${doc_name}-${value_objects[0].branch_short}`
  }
  return {
    doc_name: doc_name,
    value_objects: value_objects,
    db_name: db_name
  }
}

// WEEKLY OBJECT EXAMPLE
// qtr: "2022 / 4"
// week: "week 1",
// branch: "Middleton",
// value: "134",
// target_column: "Total Number of Eye Exams Completed"

function pasteWeeklyValues(value_objects, doc_name) {
  const db_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("DB (WEEKLY)");
  const last_row = db_sheet.getLastRow()
  let main_selectors = []
    main_selectors.unshift('')
    main_selectors.unshift('')

  const main_selector_values = db_sheet.getRange(2,1,last_row-1,3).getValues()
  main_selector_values.forEach(row => {
    main_selectors.push(`${row[0]}/${row[1]}/${row[2]}`)
  })

  value_objects.forEach(obj => {
    const column = WEEKLY_DATABASE_COLUMNS.indexOf(obj.target_column) + 1
    const key = `${obj.qtr}/${obj.week}/${obj.branch}`
    console.log(key)
    const row = main_selectors.indexOf(key)
    console.log(row)
    db_sheet.getRange(row, column).setValue(obj.value)
  })
  return doc_name
}

// WEEKLY OBJECT EXAMPLE
// date: "31/12/2022"
// value: "134",
// target_column: "Number of EE Completed"

function pasteDailyValues(value_objects, doc_name) {
  const db_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("DB (DAILY)");
  const last_row = db_sheet.getLastRow()
  let main_selectors = []
    main_selectors.unshift('')
    main_selectors.unshift('')

  const main_selector_values = db_sheet.getRange(2,1,last_row-1,1).getValues()
  main_selector_values.forEach(date => {
    main_selectors.push(
      transformDate(new Date(date[0])).string
    )
  })
  
  value_objects.forEach(obj => {
    const column = DAILY_DATABASE_COLUMNS.indexOf(obj.target_column) + 1
    const key = `${obj.date.toString()}`
    const row = main_selectors.indexOf(key)
    db_sheet.getRange(row, column).setValue(obj.value)
  })
  return {
    doc_name: doc_name,
    value_objects: value_objects,
    db_name: "DB (DAILY)"
  }
}
