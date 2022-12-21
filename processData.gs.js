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

// ===============================

function process_ProductSalesByBrand(data, period) {
  const branch_names = BRANCHES.map(x => x.name)
  let data_by_branch = []
  for(let i = 1; i < data.length; i++) {
    if (
      branch_names.indexOf(data[i][5].toString()) != -1 && 
      data[i][11].toString().indexOf('Professional Fee') != -1 && 
      (data[i][24].toString().indexOf('CUES') != -1 || data[i][25].toString().indexOf('CUES')  != -1)
    ) {
      // console.log(`${data[i][5]} / ${data[i][11]} / ${data[i][24]} / ${data[i][25]} / ${i}: ${data[i][28]}`)
      data_by_branch.push({
        branch: data[i][5].toString(),
        value: Number(data[i][28])
      })
    }
  }
  let branch_value_map = new Map()
  data_by_branch.forEach(row => {
    let branch_value = branch_value_map.get(row.branch)
    if (branch_value == undefined) {
      branch_value_map.set(row.branch, Number(row.value))
    } else {
      branch_value_map.set(row.branch, Number(row.value) + Number(branch_value))
    }
  })

  let value_objects = []
  branch_names.forEach(branch => {
    let value = branch_value_map.get(branch)
    if(value != undefined) {
      value_objects.push({
        qtr: period.qtr,
        week: period.week,
        branch: branch,
        value: value,
        target_column: 'Total Number of CUES put through the till'
      })
    }
  })
  console.log(value_objects)
  return value_objects
}

function process_AppointmentsByBookingDate(data, period) {
  let data_by_branch = []

  for(let i = 1; i < data.length; i++) {
    if(data[i][1].toString().indexOf('Eye Exam') != -1) {
      let value = 0
      for(let j = 2; j < 6; j++) {
        let num = Number(data[i][j])
        if(num * 1 == num) {
          value += num
        }
      }
      data_by_branch.push({
        branch: data[i][0],
        value: value,
      })
    }
  }

  let branch_value_map = new Map()
  
  data_by_branch.forEach(row => {
    let branch_value = branch_value_map.get(row.branch)
    if (branch_value == undefined) {
      branch_value_map.set(row.branch, Number(row.value))
    } else {
      branch_value_map.set(row.branch, Number(row.value) + Number(branch_value))
    }
  })

  let value_objects = []
  BRANCHES.map(x => x.name).forEach(branch => {
    let value = branch_value_map.get(branch)
    if(value != undefined) {
      value_objects.push({
        qtr: period.qtr,
        week: period.week,
        branch: branch,
        value: value,
        target_column: 'Total Number of Eye Exams Booked'
      })
    }
  })

  return value_objects
}

function process_DiaryRecallUnchanged (data, period) {
  let data_by_branch = []
  for(let i = 1; i < data.length; i++) {
    if(data[i][0] != data[i-1][0] & data[i][0].indexOf('Branch: ') != -1) {
      data_by_branch.push({
        branch: data[i][0].substring(8, data[i][0].length),
        num_new_CUES_no_recall_assigned: 0,
      })
    }

    if (data[i][0].indexOf('Branch: ') != -1 && data[i][6].indexOf("CUES") != -1 && data[i][10].indexOf("Yes") != -1){
      data_by_branch[data_by_branch.length-1].num_new_CUES_no_recall_assigned += 1
    }
  }

  let value_objects = []
  data_by_branch.forEach(branch => {
    value_objects.push({
      qtr: period.qtr,
      week: period.week,
      branch: branch.branch,
      value: branch.num_new_CUES_no_recall_assigned,
      target_column: 'Number of New CUES with No Recall Assigned'
    })
  })
  
  return value_objects
}

function process_BranchKpiSummaryData(data, period) {
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
      data_by_branch[data_by_branch.length-1].cues_completed -= Number(data[i][4])
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


function process_DiaryNewPatientsBranch(data, period) {
  let data_by_branch = []
  for(let i = 1; i < data.length; i++) {
    if(data[i][0] != data[i-1][0] & data[i][0].indexOf('Branch: ') != -1) {
      data_by_branch.push({
        branch: data[i][0].substring(8, data[i][0].length),
        ee_completed: 0,
        ee_booked: 0,
        new_cues_completed: 0
      })
    }

    if (data[i][8].indexOf("Completed") != -1 && data[i][7].indexOf("Eye Exam") != -1){
      data_by_branch[data_by_branch.length-1].ee_completed += 1
    } else if (data[i][8].indexOf("Booked") != -1 && data[i][7].indexOf("Eye Exam") != -1) {
      data_by_branch[data_by_branch.length-1].ee_booked += 1
    } else if (data[i][8].indexOf("Completed") != -1 && data[i][7].indexOf("CUES") != -1){
      data_by_branch[data_by_branch.length-1].new_cues_completed += 1
    }
  }

  let value_objects = []
  for(i=0; i < data_by_branch.length; i++) {
    const target_columns = {
      ee_completed: ['Number of New Eye Exams Completed', 'New EE Completed'],
      ee_booked: ['Number of New EE Booked', 'New EE Booked'],
      //new_cues_completed: ['Number of New CUES Completed']
    }
    data_by_branch.forEach(branch => {
      // target_columns.new_cues_completed.forEach(column => {
      //   value_objects.push({
      //     qtr: period.qtr,
      //     week: period.week,
      //     branch: branch.branch,
      //     value: branch.new_cues_completed,
      //     target_column: column
      //   })
      // })

      target_columns.ee_completed.forEach(column => {
        value_objects.push({
          qtr: period.qtr,
          week: period.week,
          branch: branch.branch,
          value: branch.ee_completed,
          target_column: column
        })
      })
      
      target_columns.ee_booked.forEach(column => {
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

  let new_clients = new Map()
  for (let i = 0; i < data_by_branch.length; i++) {
    if(data_by_branch[i].why_us.indexOf('Prospect') == -1 && data_by_branch[i].why_us.indexOf('Existing Client') == -1) { 
      console.log(data_by_branch[i].why_us)
      let branch_val = Number(new_clients.get(data_by_branch[i].branch))
      if(new_clients.get(data_by_branch[i].branch) == undefined) {
        new_clients.set(data_by_branch[i].branch, Number(data_by_branch[i].total_for_segment))
      } else {
        new_clients.set(data_by_branch[i].branch, Number(data_by_branch[i].total_for_segment) + branch_val)
      }
    }
  }
  BRANCHES.map(x => x.name).forEach(branch => {
    let total_for_segment = new_clients.get(branch)
    if(total_for_segment != undefined) {
      data_by_branch.push({
        branch: branch,
        why_us: 'New clients - Why Us',
        total_for_segment: total_for_segment
      })
    }
  })

  const fields = ['Prospect', 'Referral', 'CUES/PEARS to EE', 'Work Voucher', 'Reviews on Internet', 'Local to the Area', 'Family & Friends', 'New clients - Why Us']
  const target_column_map = new Map()
  const target_column_map_details = new Map()

  target_column_map.set('New clients - Why Us', 'New clients - Why Us');
  target_column_map.set('Prospect', 'Prospect');
  target_column_map.set('Referral', 'Referral');
  target_column_map.set('CUES/PEARS to EE', 'CUES/PEARS To EE');
  target_column_map.set('Work Voucher', 'Work Voucher');
  target_column_map.set('Reviews on Internet', 'Reviews on Internet');
  target_column_map.set('Local to the Area', 'Local to Area');
  target_column_map.set('Family & Friends', 'Family & Friends');

  target_column_map_details.set('Referral', '# New EE - Referral');
  target_column_map_details.set('CUES/PEARS To EE', '# New EE - CUES CONVERSIONS');
  target_column_map_details.set('Local to Area', '# New EE - Local to Area');
  target_column_map_details.set('Family & Friends', '# New EE - Family & Friends');
  
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
    

    if(data_by_branch[i].branch != '' && target_column != undefined) {
      value_objects.push({
        qtr: period.qtr,
        week: period.week,
        branch: data_by_branch[i].branch,
        value: data_by_branch[i].total_for_segment,
        target_column: target_column
      }) 
    }
  }
  let detail_objects = []
  value_objects.forEach(obj_d => {
    const detail_column_name = target_column_map_details.get(obj_d.target_column)
    if(detail_column_name != undefined) {
      detail_objects.push({
        qtr: obj_d.qtr,
        week: obj_d.week,
        branch: obj_d.branch,
        value: obj_d.value,
        target_column: detail_column_name
      }) 
    }
  })
  
  return value_objects.concat(detail_objects)
}
