// ID OBJECT EXAMPLE
// qtr: '2022 / 4',
// week: 'week 1',
// px_public_id: 13474,
// values: [["Stephen", "test", "test", "test", "test", "test", "test", "test", "test", "test", "test", "test", "test"]],
// target_range: {start_col: 5, col_len: 12}

function pastePatientTransactionsValues(value_objects, doc_name) {
  const db_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("DB (Patient Transactions)");
  const last_row = db_sheet.getLastRow()
  const start_col = value_objects[0].target_range.start_col
  const col_len = value_objects[0].target_range.col_len

  let new_rows = []
  let new_keys = []
  let if_change_rows = false
  let main_selectors = []
    main_selectors.unshift('')
    main_selectors.unshift('')

  const main_selector_values = db_sheet.getRange(2,1,last_row-1,11).getValues()
  main_selector_values.forEach(row => {
    main_selectors.push(`${row[0]}/${row[1]}/${row[2]}/${row[8]}/${row[9]}/${row[10]}`)
  }) 
  
  value_objects.forEach(obj => {
    const key = `${obj.qtr}/${obj.week}/${obj.px_public_id}/${obj.values[0][4]}/${obj.values[0][5]}/${obj.values[0][6]}`
    let row = main_selectors.indexOf(key)

    if (row == -1) {
      new_rows.push(obj.values[0])
      new_keys.push([obj.qtr, obj.week, obj.px_public_id])
    } else {
      if (if_change_rows == false) { if_change_rows = true }
    }
  })

  if (new_keys.length > 0) {
    db_sheet.getRange(last_row + 1, 1, new_keys.length, 3).setValues(new_keys)
    db_sheet.getRange(last_row + 1, start_col, new_rows.length, col_len).setValues(new_rows)
  }
  if(if_change_rows) {
    console.log('Err: rows already exist')
  }
  
  return doc_name
}

function process_PatientTransactions (data, period) {
  let value_objects = []
  data.forEach(row => {
    if(row[6].length > 0) {
      value_objects.push({
        qtr: period.qtr,
        week: period.week,
        px_public_id: row[2],
        values: [[row[0], row[1], row[3], row[4], row[5], row[6], row[7], row[8], row[9], row[10], row[11], row[12]]],
        target_range: {start_col: 5, col_len: 12}
        
      })
    }
  })
  value_objects.shift()
  return value_objects
}
