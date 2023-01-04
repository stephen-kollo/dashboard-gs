function runSingleTest_TillOpticianPerformanceAnalysis() {
  const url = 'https://docs.google.com/spreadsheets/d/1-ppUWzjv3eXkBa5a24e1TxF-_8n10pCrVoMjZvaKYJ0/edit#gid=1679413519'
  let res = testSingleDoc(url, "Till Optician Performance Analysis", process_TillOpticianPerformanceAnalysisData, "Till Optician Performance Analysis")
  console.log(res.res_values)
}


function process_TillOpticianPerformanceAnalysisData(data, period) {
  const target_column = 'Total Number of Eye Exams Completed'
  const branches = BRANCHES.map(x => x.name)
  let branch_map = new Map();

  let starting_row = 1
  while(data[starting_row - 1][0] != "BranchName") {
    starting_row++
  }

  let ending_row = starting_row + 1
  while(data[ending_row + 1][0] != "") {
    ending_row++
  }

  branches.forEach(branch => {
    branch_map.set(branch, {
      qtr: period.qtr,
      week: period.week,
      branch: branch,
      value: Number(0),
      target_column: target_column
    })
  })
  
  for (let i = starting_row; i <= ending_row; i++) {
    if (data[i][1].indexOf('System Administrator') == -1) {
      let branch_name = data[i][0].substring(8)
      let temp_object = branch_map.get(branch_name)
      temp_object.value += Number(data[i][8])
      branch_map.set(branch_name, temp_object)
    } 
  }

  let value_objects = []
  branch_map.forEach(branch => {
    value_objects.push(branch)
  })
  return value_objects
}
