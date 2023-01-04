function process_Takings(data, date) {
  const columns = [
    {
      target_column: 'Till Takings',
      data_column: 'Total Takings',
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
