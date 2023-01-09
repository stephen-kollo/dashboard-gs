function test_BranchKpiSummary() {
  const data = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1SEeDyZQrO2UMJxM6fM4aX2AfcV7o8_va7tF0xJojkak/edit#gid=0').getSheetByName('Sheet1').getRange(1,1,6,26).getValues()
  console.log(process_BranchKpiSummary(data, '01/07/2023'))
  pasteDailyValues(process_BranchKpiSummary(data, '01/07/2023'), "doc_name")
}

function process_BranchKpiSummary(data, date) {
  const columns = [
    {
      target_column: 'Total Sales £',
      data_column: 'Total Sales',
      type: '£'
    },
    {
      target_column: '% Conv Rate - EE to Dispense',
      data_column: 'Dispense Sales per Eye Exam - %',
      type: '%'
    },
    {
      target_column: 'AVG Dispensed Value £',
      data_column: 'Average Dispense Sale',
      type: '£'
    },
    {
      target_column: 'Number of CL Fittings',
      data_column: 'New CL Fittings',
      type: 'Int'
    },
  ]
  let branch_map = data.map(row => row[0])

  let value_objects = []
  BRANCHES.forEach(branch => {
    for(let i = 0; i < columns.length; i++) {
      let value = data[branch_map.indexOf(branch)][data[0].indexOf(columns[i].data_column)].toString()
      value = value.replace('£', "")
      value = value.replace('%', "")
      value = value.replace(',', "")
      value = Number(value)
      if (columns[i].type == "%" && value > 1) {
        value = value / 100
      }
      value_objects.push({
        branch: branch,
        date: date,
        value: value,
        target_column: columns[i].target_column
      })
    }
  })
  let total_disp_sales = Number(data[5][data[0].indexOf("Dispense Sales per Eye Exam - %")].toString().replace('%', ""))
  let avg_disp_value = Number(data[5][data[0].indexOf("Average Dispense Sale")].toString().replace('£', "").replace(',', ""))
  value_objects.push({
    branch: "Total",
    date: date,
    value: total_disp_sales > 1 ? total_disp_sales / 100 :  total_disp_sales,
    target_column: '% Conv Rate - EE to Dispense'
  })
  value_objects.push({
    branch: "Total",
    date: date,
    value: avg_disp_value,
    target_column: 'AVG Dispensed Value £'
  })
  
  return value_objects
}
