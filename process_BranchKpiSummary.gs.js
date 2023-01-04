function process_BranchKpiSummary(data, date) {
  const columns = [
    {
      target_column: 'Dispensed Sales',
      data_column: 'Value of Dispenses',
      type: '£'
    },
    // {
    //   target_column: 'Number of EE Completed',
    //   data_column: 'No of Eye Exams',
    //   type: 'Int'
    // },
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
      target_column: 'Number of Additional Pairs Dispensed',
      data_column: 'No of Pairs Dispensed',
      type: 'Int'
    },
  ]
  
  let value_objects = []
  for(let i = 0; i < columns.length; i++) {
    let value = data[5][data[0].indexOf(columns[i].data_column)]
    value = value.replace('£', "")
    value = value.replace('%', "")
    value = value.replace(',', "")
    value = Number(value)
    if (columns[i].type == "%") {
      value = value / 100
    }
    value_objects.push({
      date: date,
      value: value,
      target_column: columns[i].target_column
    })
  }
  
  return value_objects
}

// function test_kpi_sum() {
//   const source_data_ss = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1-ppUWzjv3eXkBa5a24e1TxF-_8n10pCrVoMjZvaKYJ0/edit#gid=481526659').getSheetByName('Branch KPI Summary')
//   const data = source_data_ss.getRange(1,1,6,25).getValues()
//   process_BranchKpiSummary(data, '03/01/2023')
// }
