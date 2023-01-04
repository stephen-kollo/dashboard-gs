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
