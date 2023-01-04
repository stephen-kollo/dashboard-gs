function test() {
  console.log(runStageTests('https://docs.google.com/spreadsheets/d/1FKLr8AtHocGtE_9vKZGfqunz20WqcjYiY9aXcYB2_uI/edit#gid=0'))
}

// function runSingleTest() {
//   const url = 'https://docs.google.com/spreadsheets/d/13yOzujYeYorx2uDv-gkuVnpE6fIT7SQdE6ECWESEoBY/edit?usp=sharing'
//   let res = testSingleDoc(url, "Why Us", process_WhyUs, "Why Us - Weekly DB")
//   // console.log(res.res_values)
// }

function runStageTests(url) {
  let testing_data = [
    testSingleDoc(url, "Appointments By Booking Date", process_AppointmentsByBookingDate, "Appointments By Booking Date"),
    testSingleDoc(url, "Till Optician Performance Analysis", process_TillOpticianPerformanceAnalysisData, "Till Optician Performance Analysis"),
    // testSingleDoc(url, "Diary Recall Unchanged", process_DiaryRecallUnchanged, "Diary Recall Unchanged"),
    testSingleDoc(url, "Product Sales By Brand", process_ProductSalesByBrand, "Product Sales By Brand"),
    testSingleDoc(url, "Scheme Analysis", process_SchemeAnalysis, "Scheme Analysis"),
    testSingleDoc(url, "Why Us", process_WhyUs, "Why Us - Weekly DB"),
    testSingleDoc(url, "Why Us", process_WhyUs_Id, "Why Us - ID DB"),
    testSingleDoc(url, "Diary New Patients Branch", process_DiaryNewPatientsBranch, "Diary New Patients Branch - Weekly DB"),
    testSingleDoc(url, "Diary New Patients Branch", process_DiaryNewPatientsBranch_Id, "Diary New Patients Branch - ID DB"),
    testSingleDoc(url, "Patient Transactions", process_PatientTransactions, "Patient Transactions - ID DB")
  ]
  let res = []
  testing_data.forEach(test => {
    let short_report 
    if (test.complete) {
      short_report = `${test.name} :: Got ${test.report.length} values / total sum: ${test.sum}`
    } else {
      short_report = `${test.name} :: Got ${test.report.length} values / total sum: ${test.sum}`
    }
  
    res.push({
      short_report: short_report,
      status: test.complete,
      err: test.err,
      err_type: test.err_type
    })
  })
  return res
}

function testSingleDoc(url, sheet_name, checking_function, test_name) {
  let data
  let source_data_ss
  let sheet
  let value_objects
  let res = {
    name: test_name,
    err: '',
    err_type: '',
    report: [],
    complete: false,
    res_values: [],
    sum: 0
  }
  const period = {qtr: '2022 / 4', week: 'week 4'}

  try {
    source_data_ss = SpreadsheetApp.openByUrl(url)
  } catch (e) {
    res.err = 'Incorrect source data spreadsheet URL'
    return res
  }

  try {
    sheet = source_data_ss.getSheetByName(sheet_name)
    data = sheet.getRange(1,1,sheet.getLastRow(),sheet.getLastColumn()).getValues()
  } catch (e) {
    res.err = `Sheet "${sheet_name}" was not found by URL`
    return res
  }
  
  try {
    value_objects = checking_function(data, period)
    res.res_values = value_objects
  } catch (e) {
    res.err = `Processing data "${sheet_name}" failed. Check the structure of the original document against the example at this link: https://docs.google.com/spreadsheets/d/1FKLr8AtHocGtE_9vKZGfqunz20WqcjYiY9aXcYB2_uI/edit?usp=sharing`
    return res
  }
  
  res.res_values.forEach(value_object => {
    res.report.push(`At target column: ${value_object.target_column} / branch: ${value_object.branch} :: Value: ${value_object.value}`)
    if (value_object.value == Number(value_object.value)) {
      res.sum += value_object.value
    } else if (res.name.indexOf('ID DB') != -1) {
      res.sum += 1
    }
  })
  if (res.report.length == 0) {
    res.err = 'No relevant data on the sheet'
  } else {
    res.complete = true
  }
  return res
}

