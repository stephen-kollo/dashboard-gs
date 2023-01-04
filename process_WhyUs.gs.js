function pasteWhyUsValues(value_objects, doc_name) {
  const db_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("DB (Why Us)");
  const last_row = db_sheet.getLastRow()
  
  let new_rows = []
  let new_keys = []
  let if_change_rows = false
  let main_selectors = []
    main_selectors.unshift('')
    main_selectors.unshift('')

  const main_selector_values = db_sheet.getRange(2,1,last_row-1,4).getValues()
  main_selector_values.forEach(row => {
    main_selectors.push(`${row[0]}/${row[1]}/${row[2]}/${row[3]}`)
  }) 

  value_objects.forEach(obj => {
    const key = `${obj.qtr}/${obj.week}/${obj.branch}/${obj.name}`
    let row = main_selectors.indexOf(key)
    

    if (row == -1) {
      new_rows.push([obj.why_us])
      new_keys.push([obj.qtr, obj.week, obj.branch, obj.name])
    } else {
      if (if_change_rows == false) { if_change_rows = true }
    }
  })

  if (new_keys.length > 0) {
    db_sheet.getRange(last_row + 1, 1, new_keys.length, 4).setValues(new_keys)
    db_sheet.getRange(last_row + 1, 5, new_rows.length, 1).setValues(new_rows)
  }
  if(if_change_rows) {
    console.log('Err: rows already exist')
  }
  
  return doc_name
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
  console.log(data_by_branch)
  let new_clients = new Map()
  for (let i = 0; i < data_by_branch.length; i++) {
    if(data_by_branch[i].why_us.indexOf('Prospect') == -1 && data_by_branch[i].why_us.indexOf('Existing Client') == -1) { 
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
  for(i=0; i < data_by_branch.length; i++) {
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
  // console.log(value_objects)
  return value_objects.concat(detail_objects)
}

function process_WhyUs_Id (data, period) {
  let value_objects = []
  
  data.forEach(row => {
    if(row[5].length > 0 ) {
      value_objects.push({
        qtr: period.qtr,
        week: period.week,
        branch: row[1],
        name: row[5],
        why_us: row[3]
      })
    }
  })
  value_objects.shift()
  return value_objects
}

// function runSingleTest_WhyUs() {
//   const url = 'https://docs.google.com/spreadsheets/d/13yOzujYeYorx2uDv-gkuVnpE6fIT7SQdE6ECWESEoBY/edit?usp=sharing'
//   let res = testSingleDoc(url, "Why Us", process_WhyUs, "Why Us - Weekly DB")
//   // console.log(res.res_values)
// }
