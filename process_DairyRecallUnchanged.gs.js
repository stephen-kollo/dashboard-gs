function test_DairyRecallUnchanged() {
  const source_data_ss = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1-ppUWzjv3eXkBa5a24e1TxF-_8n10pCrVoMjZvaKYJ0/edit#gid=0')
  const id_data = {
    patientTransactions: source_data_ss.getSheetByName("Patient Transactions").getRange(1,1,738,33).getValues(),
    diaryNewPatientsBranch: source_data_ss.getSheetByName("Diary New Patients Branch").getRange(1,1,38,12).getValues(),
    whyUs: source_data_ss.getSheetByName("Why Us").getRange(1,1,38,12).getValues(),
  }
  let data = source_data_ss.getSheetByName("Diary Recall Unchanged").getRange(1,1,138,15).getValues()
  process_DairyRecallUnchanged(data, {qtr: '2022 / 4', week: 'week 3'}, id_data)
}

function process_DairyRecallUnchanged(data, period, id_data) {
  const ids = readIds(id_data.diaryNewPatientsBranch)

  let branches = new Map()
  BRANCHES.map(x => x.name).forEach(branch => {
    branches.set(branch, {
      branch: branch,
      number_of_cues_no_recall_assigned: 0
    })
  })

  ids.forEach(id => {
    data.forEach(row => {
      if( id.id == row[7]) {
        id.status = true
      }
    })
    if (id.status == false) {
      let branch_temp = branches.get(id.branch)
      branch_temp.number_of_cues_no_recall_assigned += 1
    }
  })

  let value_objects = []
  branches.forEach(branch => {
    value_objects.push({
      qtr: period.qtr,
      week: period.week,
      branch: branch.branch,
      value: branch.number_of_cues_no_recall_assigned,
      target_column: 'Number of New CUES with No Recall Assigned'
    })
  })
  return value_objects
}

function readIds(diaryNewPatientsBranch) {
  let ids = []
  diaryNewPatientsBranch.forEach(row => {
    if(row[8].toString().indexOf("Completed") != -1 && row[7].toString().indexOf("CUES") != -1) {
      ids.push({
        id: row[2],
        branch: row[0].substring(8),
        status: false
      })
    }
  })
  return ids
}
