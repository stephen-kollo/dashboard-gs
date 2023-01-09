function test_AppointmentsByBookingDate_Adult() {
  const data = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1-7_coPxSmizpOurWS7Zlcthh66HVomTVsd5VQzN3RdA/edit#gid=0').getSheetByName('Data').getRange(1,1,777,10).getValues()
  console.log(process_AppointmentsByBookingDate_Adult(data, "06/01/2023"))
}

function process_AppointmentsByBookingDate_Adult(data, date) {
  let data_by_branch = []
  for(let i = 1; i < data.length; i++) {
    if(data[i][1].toString().indexOf('Eye Exam') != -1 && data[i][1].toString().indexOf('Child') == -1) {
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
  BRANCHES.forEach(branch => {
    let value = branch_value_map.get(branch)
    if(value != undefined) {
      value_objects.push({
        date: date,
        branch: branch,
        value: value,
        target_column: 'Number of Adult Eye Exams Booked'
      })
    }
  })

  return value_objects
}
