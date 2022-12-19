function checkPeriod(new_week, new_qtr, if_checked) {
  const db_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("DB (WEEKLY)");
  const last_row = db_sheet.getLastRow()
  const all_periods = db_sheet.getRange(2, 1, last_row - 1, 2).getValues().map(x => x[0] + " / " + x[1])
  
  const prev_period = db_sheet.getRange(last_row, 1, 1, 2).getValues()
  const last_week = prev_period[0][1]
  const last_qtr = prev_period[0][0]
  
  let res = {
    err: '',
    status: false,
    last_week: last_week.charAt(0).toUpperCase() + last_week.slice(1),
    last_qtr: last_qtr,
    new_week: new_week.charAt(0).toUpperCase() + new_week.slice(1),
    new_qtr: new_qtr,
  }
  // 
  const numeric_values = {
    last_week: last_week.substring(5),
    last_qtr: last_qtr.substring(2,4) + last_qtr.substring(7),
    new_week: new_week.substring(5),
    new_qtr: new_qtr.substring(2,4) + new_qtr.substring(7),
  }
  if (if_checked == false) {
    if (
      // for new qtr
      (numeric_values.last_week == 13 && numeric_values.new_week == 1 && (numeric_values.new_qtr - numeric_values.last_qtr == 1 || numeric_values.new_qtr - numeric_values.last_qtr == 7)) || 
      // for same qtr
      (numeric_values.new_week - numeric_values.last_week == 1 && numeric_values.last_qtr == numeric_values.new_qtr)) {
      res.status = true
      setNewWeek(new_week, new_qtr, db_sheet)
    } else {
      res.err = `Period "${new_week} of QTR ${new_qtr}" doesn't go after your last period "${last_week} of QTR ${last_qtr}"`
    }
  } else {
    if (all_periods.indexOf(`${new_qtr} / ${new_week}`) != -1) {
      res.status = true
    } else {
      res.err = `Period "${new_week} of QTR ${new_qtr}" doesn't match any of your last periods`
    }
  }
  
  return res
}

function setNewWeek(week, qtr, db_sheet) {
  db_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("DB (WEEKLY)");
  let last_row = db_sheet.getLastRow()
  const branches = BRANCHES
  // const total_row = last_row + branches.length + 1

  branches.forEach(branch => {
    last_row += 1
    db_sheet.getRange(last_row, 1, 1, 3).setValues([[qtr, week, branch]])
  })
  db_sheet.getRange(last_row + 1, 1, 1, 3).setValues([[qtr, week, 'Total']])
  setWeeklyDBFormulas(last_row + 1)
}

function setWeeklyDBFormulas(total_row) {
  db_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("DB (WEEKLY)");
  const column_letters = COLUMN_LETTERS

  const sumOfRowsAbove = `=SUM(R[-${BRANCHES.length}]C[0]:R[-1]C[0])`;
  let formulas = column_letters.map(x => sumOfRowsAbove)
  const cells = db_sheet.getRange(`D${total_row}:AO${total_row}`);
  
  cells.setFormulasR1C1([formulas]);
}



