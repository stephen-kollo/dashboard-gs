function test_ProductSalesByBrand() {
  const data = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Product Sales by Brand").getRange(1,1,317,33).getValues()
  processRawData(data, 'ProductSalesByBrand', {qtr: '2022 / 4', week: 'week 2'})
  
}

function test_WhyUs() {
  const data = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("ID: Why Us").getRange(1,1,317,33).getValues()
  processRawData(data, 'WhyUs', {qtr: '2022 / 4', week: 'week 3'})
}

// function test_calculateIdFields() {
//   const id_data = {
//     whyUs: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("ID: Why Us").getRange(1,1,317,33).getValues(),
//     diaryNewPatientsBranch: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("ID: DiaryNewPatientsBranch").getRange(1,1,317,33).getValues(),
//   }
//   calculateIdFields(id_data, {qtr: '2022 / 4', week: 'week 3'})
// }
