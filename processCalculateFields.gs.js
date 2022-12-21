function test_calculateIdFields() {
  const id_data = {
    patientTransactions: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("ID: Patient Transactions").getRange(1,1,3788,33).getValues(),
    diaryNewPatientsBranch: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("ID: DiaryNewPatientsBranch").getRange(1,1,111,12).getValues(),
    whyUs: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("ID: Why Us").getRange(1,1,239,12).getValues(),
  }
  calculateIdFields(id_data, {qtr: '2022 / 4', week: 'week 3'})
}

function calculateEeDispensed(data, period) {
  let new_ee = new Map()
  let value_objects = []
  let branches = new Map()
  BRANCHES.map(x => x.name).forEach(branch => {
    branches.set(branch, {
      branch: branch,
      sales_sum: 0,
      number_of_clients: 0
    })
  })

  data.diaryNewPatientsBranch.forEach(row => {
    if(row[7].indexOf("Eye Exam") != -1) {
        new_ee.set(row[2], {id: row[2], branch: row[0].substring(8), sales: 0})
    }
  })
   
  data.patientTransactions.forEach(row => {
    new_sale = new_ee.get(row[2])
    if(new_sale != undefined && row[5] == "Payment" && row[11].substring(0,1) == '£') {
      new_sale.sales += Number(row[11].substring(1, row[11].length - 1))
      new_ee.set(row[2], new_sale)
    }
  })
  new_ee.forEach(client => {
    if(client.sales != 0) {
      branch = branches.get(client.branch)
      branch.number_of_clients += 1
      branch.sales_sum += client.sales 
      branches.set(branch.branch, branch)
    }
  })
  branches.forEach(branch => {
    let avg = branch.sales_sum / branch.number_of_clients
    value_objects.push({
      qtr: period.qtr,
      week: period.week.toLowerCase(),
      branch: branch.branch,
      value: branch.number_of_clients,
      target_column: 'Number of New Eye Exams Dispensed'
    })
    value_objects.push({
      qtr: period.qtr,
      week: period.week.toLowerCase(),
      branch: branch.branch,
      value: branch.number_of_clients,
      target_column: 'New EE Converted'
    })
    value_objects.push({
      qtr: period.qtr,
      week: period.week.toLowerCase(),
      branch: branch.branch,
      sum_sales_info: branch.sales_sum,
      value: Math.round(avg),
      target_column: '£ ADV - New EE Dispensed'
    })
    value_objects.push({
      qtr: period.qtr,
      week: period.week.toLowerCase(),
      branch: branch.branch,
      sum_sales_info: branch.sales_sum,
      value: Math.round(avg),
      target_column: 'New EE ADV £'
    })
  })
  return value_objects
}

function calculateIdFields(id_data, period) {
  let dispensed_value_objects = calculateEeDispensed({
    patientTransactions: id_data.patientTransactions, 
    diaryNewPatientsBranch: id_data.diaryNewPatientsBranch
  }, period)
  
  let new_cues = []
  id_data.whyUs.forEach(row => {
    if(row[3].toString().indexOf("New CUES") != -1) {
      new_cues.push(row[5].toString().toLowerCase().replace(/\s/g, ''))
    }
  })
  let data_by_branch = []
  id_data.diaryNewPatientsBranch.forEach(row => {
    if(row[8].toString().indexOf("Completed") != -1 && row[7].toString().indexOf("CUES") != -1) {
      let name_completed = row[3].toString().toLowerCase().replace(/\s/g, '')
      
      new_cues.forEach(name => {
        if(name_completed.indexOf(name) != -1) {
          data_by_branch.push({
            branch: row[0].substring(8),
            name: row[3].toString()
          })
        }
      })
    }
  })

  let branch_value_map = new Map()
  
  data_by_branch.forEach(row => {
    let branch_value = branch_value_map.get(row.branch)
    if (branch_value == undefined) {
      branch_value_map.set(row.branch, 1)
    } else {
      let new_val = branch_value + 1
      branch_value_map.set(row.branch, new_val)
    }
  })

  let value_objects = []
  BRANCHES.map(x => x.name).forEach(branch => {
    let value = branch_value_map.get(branch)
    if(value != undefined) {
      value_objects.push({
        qtr: period.qtr,
        week: period.week.toLowerCase(),
        branch: branch,
        value: value,
        target_column: 'Number of New CUES Completed'
      })
    }
  })
  let concated_value_objects = value_objects.concat(dispensed_value_objects)
  console.log(concated_value_objects)

  return pasteValues(concated_value_objects, 'DiaryNewPatientsBranch', 'DB (WEEKLY)')
}
