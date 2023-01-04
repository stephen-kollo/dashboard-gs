function process_Debtors(data, date) {
  const columns = [
    {
      target_column: 'Aged Debt £',
      data_column: 'Total Till Debtors',
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

