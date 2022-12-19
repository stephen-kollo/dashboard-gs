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
    console.log(key)
    db_sheet.getRange(row, column).setValue(obj.value)
  })
  return doc_name
}

// ===============================

function process_AppTypeByOptom (data, period) {
  let data_by_branch = []
  for(let i = 1; i < data.length; i++) {
    if(data[i][0] != data[i-1][0] & data[i][0].indexOf('Branch: ') != -1) {
      data_by_branch.push({
        branch: data[i][0].substring(8, data[i][0].length),
        cues_completed: 0,
      })
    }

    if (data[i][0].indexOf('Branch: ') != -1 && data[i][2].indexOf("CUES") != -1){
      data_by_branch[data_by_branch.length-1].cues_completed += Number(data[i][3])
    }
  }
  
  let value_objects = []
  data_by_branch.forEach(branch => {
    value_objects.push({
      qtr: period.qtr,
      week: period.week,
      branch: branch.branch,
      value: branch.cues_completed,
      target_column: 'Total Number of CUES Completed'
    })
  })
  console.log(value_objects)
  return value_objects
}

function process_BranchKpiSummaryData_Weekly(data, period) {
  const target_column_one = 'Total Number of Eye Exams Completed'
  const column_one = 'No of Eye Exams'
  let value_objects = []
  for(i=1; i < data.length; i++) {
    value_objects.push({
      qtr: period.qtr,
      week: period.week,
      branch: data[i][0],
      value: data[i][data[0].indexOf(column_one)],
      target_column: target_column_one
    })
  }
  value_objects.pop();

  return value_objects
}


function process_DiaryNewPatientsBranch(data, period) {
  let data_by_branch = []
  for(let i = 1; i < data.length; i++) {
    if(data[i][0] != data[i-1][0] & data[i][0].indexOf('Branch: ') != -1) {
      data_by_branch.push({
        branch: data[i][0].substring(8, data[i][0].length),
        ee_completed: 0,
        ee_booked: 0
      })
    }

    if (data[i][8].indexOf("Completed") != -1 && data[i][7].indexOf("Eye Exam") != -1){
      data_by_branch[data_by_branch.length-1].ee_completed += 1
    } else if (data[i][8].indexOf("Booked") != -1 && data[i][7].indexOf("Eye Exam") != -1) {
      data_by_branch[data_by_branch.length-1].ee_booked += 1
    }
  }

  let value_objects = []
  for(i=0; i < data_by_branch.length; i++) {
    const target_columns = {
      completed: ['Total Number of Eye Exams Completed', 'New EE Completed'],
      booked: ['Number of New EE Booked', 'New EE Booked',]
    }
    data_by_branch.forEach(branch => {
      target_columns.completed.forEach(column => {
        value_objects.push({
          qtr: period.qtr,
          week: period.week,
          branch: branch.branch,
          value: branch.ee_completed,
          target_column: column
        })
      })
      
      target_columns.booked.forEach(column => {
        value_objects.push({
          qtr: period.qtr,
          week: period.week,
          branch: branch.branch,
          value: branch.ee_booked,
          target_column: column
        })
      })
    })
  }

  return value_objects
}

function process_WhyUs(data, period) {
  let starting_row = 0;
  while (data[starting_row][6] == "") {
    starting_row++;
  }
  
  let data_by_branch = []
  for(let i = starting_row + 1; i < data.length; i++) {
    if(data[i][1] != data[i-1][1] || data[i][3] != data[i-1][3]) {
      data_by_branch.push({
        branch: data[i][1],
        why_us: data[i][3],
        total_for_segment: data[i][4]
      })
    }
  }

  const fields = ['Prospect', 'Referral', 'CUES/PEARS to EE', 'Work Voucher', 'Reviews on Internet', 'Local to the Area', 'Family & Friends']
  const target_column_map = new Map();
  // target_column_map.set('a', 'New clients - Why Us');
  target_column_map.set('Prospect', 'Prospect');
  target_column_map.set('Referral', 'Referral');
  target_column_map.set('CUES/PEARS to EE', 'CUES/PEARS To EE');
  target_column_map.set('Work Voucher', 'Work Voucher');
  target_column_map.set('Reviews on Internet', 'Reviews on Internet');
  target_column_map.set('Local to the Area', 'Local to Area');
  target_column_map.set('Family & Friends', 'Family & Friends');
  // target_column_map.set('c', 'Number with no Why Us');
  
  let value_objects = []
  for(i=1; i < data_by_branch.length; i++) {
    let target_column = target_column_map.get(data_by_branch[i].why_us)
    if (target_column == undefined) {
      for (let j = 0; j < fields.length; j++) {
        if ( data_by_branch[i].why_us.indexOf(fields[j]) != -1 ) {
          target_column = fields[j]
        }
      }
    } 
    
    if (target_column == undefined) {
      target_column = 'Number with no Why Us'
    }


    if(data_by_branch[i].branch != '') {
      value_objects.push({
        qtr: period.qtr,
        week: period.week,
        branch: data_by_branch[i].branch,
        value: data_by_branch[i].total_for_segment,
        target_column: target_column
      }) 
    }
  }

  return value_objects
}








