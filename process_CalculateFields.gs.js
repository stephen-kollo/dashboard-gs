function test_calculateIdFields() {
  const source_data_ss_transactions = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1Wy3TU1TbjCHOx4j-v87sjxqk33IbRGu2bJRvKg0OFGY/edit?usp=sharing')
  const source_data_ss_diary = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1JPS7WMv0D1M2Pc5KZuuFqk4cDvXj8-V3S_V-XASHtPs/edit?usp=sharing')
  const id_data = {
    patientTransactions: source_data_ss_transactions.getSheetByName("Patient Transactions").getRange(1,1,3788,33).getValues(),
    diaryNewPatientsBranch: source_data_ss_diary.getSheetByName("DiaryNewPatientsBranch").getRange(1,1,111,12).getValues(),
    //whyUs: source_data_ss.getSheetByName("Why Us").getRange(1,1,239,12).getValues(),
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
    let new_sale = new_ee.get(row[2])
    let value = row[10].replace('£', "");
    if(new_sale != undefined && row[5].indexOf("Eye Exam") == -1 && row[10].indexOf('£') != -1) {
      new_sale.sales += Number(value)
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
  let total_avg = {
    sum: 0,
    num: 0
  }
  branches.forEach(branch => {
    let avg = 0
    if (branch.sales_sum > 0 && branch.number_of_clients > 0) {
      avg = branch.sales_sum / branch.number_of_clients
      total_avg.sum += branch.sales_sum
      total_avg.num += branch.number_of_clients
    }

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
  
  value_objects.push({
      qtr: period.qtr,
      week: period.week.toLowerCase(),
      branch: "Total",
      sum_sales_info: branch.sales_sum,
      value: Math.round(total_avg.sum / total_avg.num),
      target_column: '£ ADV - New EE Dispensed'
    })
    value_objects.push({
      qtr: period.qtr,
      week: period.week.toLowerCase(),
      branch: "Total",
      sum_sales_info: branch.sales_sum,
      value: Math.round(total_avg.sum / total_avg.num),
      target_column: 'New EE ADV £'
    })
  
  return value_objects
}

function calculateIdFields(id_data, period) {
  let dispensed_value_objects = calculateEeDispensed({
    patientTransactions: id_data.patientTransactions, 
    diaryNewPatientsBranch: id_data.diaryNewPatientsBranch
  }, period)
  
  let data_by_branch = []
  id_data.diaryNewPatientsBranch.forEach(row => {
    if(row[8].toString().indexOf("Completed") != -1 && row[7].toString().indexOf("CUES") != -1) {
      data_by_branch.push({
        branch: row[0].substring(8)
      })
    }
  })


  // id_data.whyUs.forEach(row => {
  //   if(row[3].toString().indexOf("New CUES") != -1) {
  //     new_cues.push(row[5].toString().toLowerCase().replace(/\s/g, ''))
  //   }
  // })
  // let data_by_branch = []
  // id_data.diaryNewPatientsBranch.forEach(row => {
  //   if(row[8].toString().indexOf("Completed") != -1 && row[7].toString().indexOf("CUES") != -1) {
  //     let name_completed = row[3].toString().toLowerCase().replace(/\s/g, '')
      
  //     new_cues.forEach(name => {
  //       if(name_completed.indexOf(name) != -1) {
  //         data_by_branch.push({
  //           branch: row[0].substring(8),
  //           name: row[3].toString()
  //         })
  //       }
  //     })
  //   }
  // })

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
  // console.log(concated_value_objects)

  return pasteValues(concated_value_objects, 'DiaryNewPatientsBranch', 'DB (WEEKLY)')
}
