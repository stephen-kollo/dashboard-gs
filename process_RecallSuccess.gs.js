function pasteRecallSuccessValues(value_objects, doc_name) {
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


function process_RecallSuccess (data, period, branch_short) {
  let single_branch = ''
  BRANCHES.forEach(branch => {
    if(branch.short.toString() == branch_short.toString()) {
      single_branch = branch.name.toString()
    }
  })

  value_objects = [{
      qtr: period.qtr,
      week: period.week,
      branch: single_branch,
      value: data[1][6],
      target_column: 'Recall Sucess % Monthly',
      branch_short: branch_short
    }]
  return value_objects
}
