// DAILY
function transformDate(date) {
  try {
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
  } catch {
    return {
      date: new Date(),
      string: ''
    }
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
    if((new_date - last_date) / 1000 / 60 / 60 / 24 == 1 || ((new_date - last_date) / 1000 / 60 / 60 / 24 == 2 && new_date.getDay() == 1)) {
      res.status = true
      setNewDay(new_date)
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

function setNewDay(date) {
  let db_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("DB (DAILY)");
  let last_row = db_sheet.getLastRow()
  const branches = BRANCHES

  branches.forEach(branch => {
    last_row += 1
    db_sheet.getRange(last_row, 1, 1, 2).setValues([[date, branch]])
  })
  db_sheet.getRange(last_row + 1, 1, 1, 2).setValues([[date, 'Total']])
  setDailyDBFormulas(last_row + 1, branches)
}

function setDailyDBFormulas(total_row, branches) {
  db_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("DB (DAILY)");
  const column_letters = COLUMN_LETTERS

  const sumOfRowsAbove = `=SUM(R[-${branches.length}]C[0]:R[-1]C[0])`;
  let formulas = column_letters.map(x => sumOfRowsAbove)
  const cells = db_sheet.getRange(`C${total_row}:K${total_row}`);
  
  cells.setFormulasR1C1([formulas]);
}
