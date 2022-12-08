function dashboardMain() {
  const spreadsheet = SpreadsheetApp.getActive();
  const dashboard_sheet = spreadsheet.getSheetByName('Direct Debits');
  const groups = getGroups(dashboard_sheet)
  const care_plans = getCarePlans(dashboard_sheet)

  processWeeksData(dashboard_sheet, groups, care_plans)
}

function processWeeksData(dashboard_sheet, groups, care_plans) {
  const weeks_arr = dashboard_sheet.getRange(3,2,1,dashboard_sheet.getLastColumn() - 1).getValues()[0]
  const sums_arr = dashboard_sheet.getRange(5,2,1,dashboard_sheet.getLastColumn() - 1).getValues()[0]

  for(let i = 0; i < weeks_arr.length; i++) {
    if (weeks_arr[i] != "" && sums_arr[i] == 0) {
      processSingleWeekData(
        i + 2,
        weeks_arr[i], 
        dashboard_sheet,
        groups, 
        care_plans
      )
    }
  }
}

function processSingleWeekData(column, url, dashboard_sheet, groups, care_plans) {
  const spreadsheet = SpreadsheetApp.openByUrl(url).getSheets()[0];
  const last_row = spreadsheet.getLastRow()
  var rows = spreadsheet.getRange(1,1,last_row,1).getValues()
  rows = rows.map(item => item[0])
  // this is made to match arr id with an actual spreadsheet row not to type "row - 1" below
  rows.unshift("none")

  // CARE PLANS
  getSumsOfCarePlans_RAW(care_plans, rows, spreadsheet)
  console.log(care_plans)
  care_plans.forEach(care_plan => {
    dashboard_sheet.getRange(care_plan.row, column).setValue(care_plan.sum)
  })
  
  // GROUPS
  groups.forEach(group => {
    group.sum = getSumOfSingleGroup_RAW(group.group_name, rows, spreadsheet).sum
    console.log(group)
    dashboard_sheet.getRange(group.row, column).setValue(group.sum)
  })
}

// ######################################
// GROUPS

function getGroups(dashboard_sheet) {
  let groups = []
  const start_row_group_section = 18
  const groups_array = dashboard_sheet.getRange(start_row_group_section,1,20).getValues().map(item => item[0])
  
  for(let i = 0; i < groups_array.length; i++) {
    if(groups_array[i].length > 0 && groups_array[i] != "Increase/Decrease" ) {
      groups.push({
        group_name: groups_array[i],
        row: i + start_row_group_section
      })
    }
  }
  return groups
}

function getSumOfSingleGroup_RAW(group_name, rows, spreadsheet) {
  let range = {
    start: rows.indexOf(group_name),
    end: 0
  }
  let i = 0
  while (rows[range.start + i] == group_name) {
    i++;
  }
  range.end = i;
  
  let sum = 0
  spreadsheet.getRange(range.start, 4, range.end, 1).getValues().map(item => item[0]).forEach(unit => {sum += unit})
  
  return {
    sum: sum,
  }
}

// ######################################
// CARE PLANS

function getCarePlans(dashboard_sheet) {
  let care_plans = []
  const start_row_care_plan_section = 7
  const care_plans_array = dashboard_sheet.getRange(start_row_care_plan_section,1,10).getValues().map(item => item[0])
  
  for(let i = 0; i < care_plans_array.length; i++) {
    if(care_plans_array[i].length > 0 && care_plans_array[i] != "Increase/Decrease" ) {
      care_plans.push({
        name: care_plans_array[i],
        row: i + start_row_care_plan_section
      })
    }
  }
  return care_plans
}

function getSumsOfCarePlans_RAW(care_plans, rows, spreadsheet) {
  const range = {
    start: 1,
    end: rows.indexOf("") - 1
  }
  const names_arr = spreadsheet.getRange(range.start, 1, range.end, 1).getValues().map(item => item[0])
  const sum_arr = spreadsheet.getRange(range.start, 3, range.end, 1).getValues().map(item => item[0])
  
  care_plans.forEach(care_plan => {
    care_plan.sum = 0
    for(let i = 0; i < names_arr.length; i++) {
      if(names_arr[i].includes(care_plan.name)) {
        care_plan.sum += sum_arr[i]
      }
    }
  })

  return care_plans
}
