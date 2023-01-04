// WEEKLY
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
  let last_col = db_sheet.getLastColumn()
  let last_row = db_sheet.getLastRow()
  const branches = BRANCHES.map(x => x.name)

  branches.forEach(branch => {
    last_row += 1
    db_sheet.getRange(last_row, 4, 1, last_col - 3).setValue(0)
    db_sheet.getRange(last_row, 1, 1, 3).setValues([[qtr, week, branch]])

  })
  db_sheet.getRange(last_row + 1, 1, 1, 3).setValues([[qtr, week, 'Total']])
  setWeeklyDBFormulas(last_row + 1, branches)
}

function setWeeklyDBFormulas(total_row, branches) {
  db_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("DB (WEEKLY)");
  const column_letters = COLUMN_LETTERS

  const sumOfRowsAbove = `=SUM(R[-${branches.length}]C[0]:R[-1]C[0])`;
  let formulas = column_letters.map(x => sumOfRowsAbove)
  const cells = db_sheet.getRange(`D${total_row}:AL${total_row}`);
  
  cells.setFormulasR1C1([formulas]);
}

// DAILY
function transformDate(date) {
  let day = date.getDate()
    if (day < 10) {
      day = '0' + day;
    }
    let month = date.getMonth() + 1
    if (month < 10) {
      month = `0${month}`;
    }
    let string = month + "/" + day + "/" + date.getFullYear()
    return {
      date: new Date(string),
      string: string
    }
}

function checkPeriodDate(new_date, if_checked) {
  new_date = new Date(`${new_date.substring(3,5)}/${new_date.substring(0,2)}/${new_date.substring(6,10)}`)
  const db_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("DB (DAILY)");
  const last_row = db_sheet.getLastRow()
  const all_dates = db_sheet.getRange(2, 1, last_row - 1, 1).getValues().map(date => {
    return new Date(date[0])
  })
  const all_date_strings = db_sheet.getRange(2, 1, last_row - 1, 1).getValues().map(date => {
    let transformed = transformDate(new Date(date[0]))
    return transformed.string
  })
  
  const last_date = all_dates[all_dates.length - 1]
 
  let res = {
    err: '',
    status: false,
    last_date: transformDate(last_date),
    new_date: transformDate(new_date)
  }
  
  if (if_checked == false) {
    if((new_date - last_date) / 1000 / 60 / 60 / 24 == 1) {
      res.status = true
      db_sheet.getRange(last_row + 1, 1).setValue([new_date])
    } else {
      res.err = `Date ${res.new_date.string} doesn't go after your last date ${res.last_date.string}`
    }
  } else {
    if (all_date_strings.indexOf(res.new_date.string) != -1) {
      res.status = true
    } else {
      res.err = `Date ${res.new_date.string} doesn't match any of your last dates`
    }
  }
  console.log(res)
  return {
    err: res.err,
    status: res.status,
    last_date: res.last_date.string,
    new_date: res.new_date.string
  }
}

