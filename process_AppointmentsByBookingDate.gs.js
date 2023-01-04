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
