function process_SalesAnalysis(data, date) {
  const columns = [
    {
      target_column: 'Total Sales',
      data_column: 'Total',
      type: '£'
    },
    {
      target_column: 'Prof Fees',
      data_column: 'Fees',
      type: '£'
    }
  ]
  
  let value_objects = []
  for(let i = 0; i < columns.length; i++) {
    let value = data[5][data[0].indexOf(columns[i].data_column)]
    value = value.replace('£', "")
    value = value.replace(',', "")
    value = Number(value)

    value_objects.push({
      date: date,
      value: value,
      target_column: columns[i].target_column
    })
  }

  return value_objects
}

// function test_sales() {
//   const source_data_ss = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1-ppUWzjv3eXkBa5a24e1TxF-_8n10pCrVoMjZvaKYJ0/edit#gid=481526659').getSheetByName('Sales Analysis')
//   const data = source_data_ss.getRange(1,1,6,14).getValues()
//   process_SalesAnalysis(data, '03/01/2023')
// }
