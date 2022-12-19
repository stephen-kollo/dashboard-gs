function onOpen() {
  SpreadsheetApp.getUi().createMenu("Upload").addItem("Upload files", "importFile").addToUi();
}

function importFile(e, doc_name, period){
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
  // return data
  let res = processRawData(data, doc_name, period)
  return res
}

function processRawData(data, doc_name, period) {
  const weekly_DB_name = "DB (WEEKLY)"
  let value_objects = false
  if(doc_name == 'BranchKpiSummaryData') {
    value_objects = {
      objects: process_BranchKpiSummaryData(data, period),
      db_name: weekly_DB_name
    }
  } else if (doc_name == 'AppTypeByOptom') {
    value_objects = {
      objects: process_AppTypeByOptom(data, period),
      db_name: weekly_DB_name
    }
  } else if (doc_name == 'SchemeAnalysis') {
    value_objects = {
      objects: process_SchemeAnalysis(data, period),
      db_name: weekly_DB_name
    }
  } else if (doc_name == 'PatientTransactions') {
    value_objects = {
      objects: process_PatientTransactions(data, period),
      db_name: 'DB (Patient Transactions)'
    }
  } else if (doc_name == 'DiaryNewPatientsBranch') {
    value_objects = {
      objects: process_DiaryNewPatientsBranch_Id(data, period),
      db_name: 'DB (Diary New Patients Branch)'
    }
    if (pasteValues(value_objects.objects, doc_name, value_objects.db_name) == 'DiaryNewPatientsBranch') {
      value_objects = {
        objects: process_DiaryNewPatientsBranch(data, period),
        db_name: weekly_DB_name
      }
    } else {
      value_objects = false
    }
  } else if (doc_name == 'WhyUs') {
    value_objects = {
      objects: process_WhyUs_Id(data, period),
      db_name: 'DB (Why Us)'
    }
    if (pasteValues(value_objects.objects, doc_name, value_objects.db_name) == 'WhyUs') {
      value_objects = {
        objects: process_WhyUs(data, period),
        db_name: weekly_DB_name
      }
    } else {
      value_objects = false 
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
  return doc_name
}


// function test() {
//   const data = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("ID: Why Us").getRange(1,1,240,7).getValues()

//   let value_objects = {
//       objects: process_WhyUs_Id(data, {qtr: '2022 / 4', week: 'week 1'}),
//       db_name: "DB (Why Us)"
//     }
//   pasteValues(value_objects.objects, 'WhyUs', value_objects.db_name)
// }













