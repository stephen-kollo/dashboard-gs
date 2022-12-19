// function test() {
//   const data = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("SchemeAnalysis").getRange(1,1,285,5).getValues()

//   let value_objects = {
//       objects: process_SchemeAnalysis(data, {qtr: '2022 / 4', week: 'week 1'}),
//       db_name: "DB (WEEKLY)"
//     }
  
//   pasteValues(value_objects.objects, 'SchemeAnalysis', value_objects.db_name)
// }

function process_SchemeAnalysis (data, period) {
  let value_objects = []
  let branch_map = new Map();
  const plans = CARE_PLANS
  const branches = BRANCHES
  
  branches.forEach(branch => {
    branch_map.set(branch, {
      qtr: period.qtr,
      week: period.week,
      branch: branch,
      product: '',
      if_key: false,
      value: 0,
      target_column: 'Branch Count'
    })
    plans.forEach(plan => {
      let key = `${branch} ${plan}`
      branch_map.set(key, {
      qtr: period.qtr,
      week: period.week,
      branch: branch,
      product: '',
      if_key: false,
      value: Number(0),
      target_column: `${plan} Plan Count`
    })
    })
  })

  data.forEach(row => {
    if(row[4] != '' && row[0] != 'BranchName') {
      let key = row[0]
      plans.forEach(plan_name => {
        if(row[1].toLowerCase().indexOf(plan_name.toLowerCase()) != -1) {
          key = `${row[0]} ${plan_name}`
        } 
      })
      let temp = branch_map.get(key)
      temp.value += Number(row[3])
      branch_map.set(key, temp)
    }
  })
  
  branch_map.forEach(obj => {
    if (obj.target_column != 'Branch Count') {
      branch = obj.branch
      let temp = branch_map.get(branch)
      temp.value += obj.value
      branch_map.set(branch, temp)
    }
  })

  branch_map.forEach(obj => {
    value_objects.push(obj)
  })

  return value_objects
}


