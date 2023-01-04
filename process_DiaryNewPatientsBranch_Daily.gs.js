function process_DiaryNewPatientsBranch_Daily (data, date) {
  let count = 0
  data.forEach(row => {
    if(row[7] == "CUES" && row[8] == "Completed") {
      count++
    }
  })
  console.log(count)
  return [{
    date: date,
    value: count,
    target_column: 'Number of CUES completed'
  }]
}
