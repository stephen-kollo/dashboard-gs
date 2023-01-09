function test_process_TillOpticianPerformanceAnalysis() {
  const source_data_ss = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/15nRr14KfIxUtc16Qjlbz2qSFoJG2o7o4wmdv5q1hiJU/edit')
  const data = source_data_ss.getSheetByName("Data").getRange(1,1,25,35).getValues()
  console.log(process_TillOpticianPerformanceAnalysis(data, '01/07/2023'))

}

function process_TillOpticianPerformanceAnalysis(data, date) {
  const target_column = 'Number of EE Completed'
  const branches = BRANCHES
  let branch_map = new Map();

  let starting_row = 1
  while(data[starting_row - 1][0] != "BranchName") {
    starting_row++
    try {
      let test = data[starting_row - 1][0]
    } catch (e) {
      starting_row = starting_row - 1
      break
    }
  }

  let ending_row = starting_row + 1
  try {
    while(data[ending_row + 1][0] != "") {
      ending_row++
      try {
        let test = data[ending_row + 1][0]
      } catch (e) {
        ending_row = ending_row - 1
        break
      }
    }
  } catch (e) { 
    console.log(e) 
  }

  branches.forEach(branch => {
    branch_map.set(branch, {
      date: date,
      branch: branch,
      value: Number(0),
      target_column: target_column
    })
  })
  
  for (let i = starting_row; i <= ending_row; i++) {
    try {
      if (data[i][1].indexOf('System Administrator') == -1) {
        let branch_name = data[i][0].substring(8)
        let temp_object = branch_map.get(branch_name)
        temp_object.value += Number(data[i][8])
        branch_map.set(branch_name, temp_object)
      } 
    } catch (e) {
      console.log(e)
    }
  }
  
  let value_objects = []
  branch_map.forEach(branch => {
    value_objects.push(branch)
  })

  return value_objects
}
