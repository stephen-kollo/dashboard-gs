function process_ProductSalesByBrand(data, period) {
  const branch_names = BRANCHES.map(x => x.name)
  let data_by_branch = []
  for(let i = 0; i < data.length; i++) {
    if (
      branch_names.indexOf(data[i][5].toString()) != -1 && 
      data[i][11].toString().indexOf('Professional Fee') != -1 && 
      (data[i][24].toString().indexOf('CUES') != -1 || data[i][25].toString().indexOf('CUES')  != -1)
    ) {
      data_by_branch.push({
        branch: data[i][5].toString(),
        value: Number(data[i][28])
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
  branch_names.forEach(branch => {
    let value = branch_value_map.get(branch)
    if(value != undefined) {
      value_objects.push({
        qtr: period.qtr,
        week: period.week,
        branch: branch,
        value: value,
        target_column: 'Total Number of CUES put through the till'
      })
    }
  })
  
  return value_objects
}
