function process_TillOpticianPerformanceAnalysisData_Daily(data, date) {
  const target_column = 'Number of EE Completed'
  let count = 0
  let starting_row = 1

  while(data[starting_row - 1][0] != "BranchName") {
    starting_row++
  }
  let ending_row = starting_row + 1
  while(data[ending_row + 1][0] != "") {
    ending_row++
  }
  
  for (let i = starting_row; i <= ending_row; i++) {
    if (data[i][1].indexOf('System Administrator') == -1) {
      count += Number(data[i][8])
    } 
  }

  return [
    {
      date: date,
      value: count,
      target_column: target_column
    }
  ]
}
