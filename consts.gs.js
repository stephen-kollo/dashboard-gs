TEST_SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/1FKLr8AtHocGtE_9vKZGfqunz20WqcjYiY9aXcYB2_uI/edit?usp=sharing'

const WEEKLY_DATABASE_COLUMNS = [
    "QTR",
    "Week",
    "Group",
    "Number of Px on Recall List in Next 12 Months Rolling",
    "Number of Clients Added to Reactivation",
    "Recall Sucess % Monthly",
    "Number of New Eye Exams Completed",
    "Total Number of Eye Exams Completed",
    "Number of New Eye Exams Dispensed",
    "Number of New EE Booked",
    "Total Number of Eye Exams Booked",
    "# New EE - Referral",
    "# New EE - Google Ads",
    "# New EE - Local to Area",
    "# New EE - CUES CONVERSIONS",
    "# New EE - Family & Friends",
    "£ ADV - New EE Dispensed",
    "Total Number of CUES Completed",
    "Total Number of CUES put through the till",
    "Number of New CUES Completed",
    "Number of New CUES Converted to EE",
    "Number of New CUES with No Recall Assigned",
    "New EE Booked",
    "New EE Completed",
    "New EE Converted",
    "New EE ADV £",
    "New clients - Why Us",
    "Referral",
    "CUES/PEARS To EE",
    "Work Voucher",
    "Prospect",
    "Reviews on Internet",
    "Local to Area",
    "Family & Friends",
    "Number with no Why Us",
    "Branch Count",
    "Silver Plan Count",
    "Gold Plan Count",
    ]

const ID_DATABASE_COLUMNS = [
"QTR",
"Week",
"PxPublicID",
"PxTitle",
"Type",
"TransDate",
"PxLastName",
"TransPublicID",
"PaymentCategory",
"ItemDesc",
"SalesValue",
"Discount",
"NetSales",
"Sales",
"Takings",
"Refunds",
"Branch",
"StaffTitle",
"Textbox24",
"BookingDate",
"AppStartDate",
"AppType",
"AppStatusDesc",
"WhyUs",
"Name"
]

const MANUAL_FIELDS_WEEKLY = [
  {name: 'Number of Px on Recall List in Next 12 Months Rolling', id: 'px-on-recall'}, 
  {name: 'Number of Clients Added to Reactivation', id: 'added-to-reactivation'},
  {name: '# New EE - Google Ads', id: 'ee-google-ads'}
]

const CARE_PLANS = ['Gold', 'Silver']

const BRANCHES = [
  {
    name: 'Middleton',
    short: 'MD'
  }, 
  {
    name: 'Heald Green',
    short: 'HG'
  }, 
  {
    name: 'Heckmondwike',
    short: 'HMD'
  }, 
  {
    name: 'Cheadle',
    short: 'CH'
  }
]

const COLUMN_LETTERS = [
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
  'AA',
  'AB',
  'AC',
  'AD',
  'AE',
  'AF',
  'AG',
  'AH',
  'AI',
  'AJ',
  'AK',
  'AL',
]

function getConsts(){
  return  { 
    branches: BRANCHES,
    manual_fields_weekly: MANUAL_FIELDS_WEEKLY,
  }
}

const DAILY_DATABASE_COLUMNS = [
"Date",
"Number of Clinics",
"Avg EE Multiplier",
"Total Sales",
"Prof Fees",
"Dispensed Sales",
"Till Takings",
"% Conv Rate - Call to Booking",
"Total Number of EE Booked",
"Number of EE Booked for Next Year",
"Number of EE Completed",
"Number of CUES completed",
"Number of Dispensing Opportunities",
"% Conv Rate - EE to Dispense",
"Number of Paid OCT's",
"Number of Contact Lens Signups",
"Number of EyeCare Plan Signups",
"% CR - Dispensing Opportunities to Spec Sale",
"AVG Dispensed Value £",
"Number of New EE Dispensed",
"Number of Additional Pairs Dispensed",
"Aged Debt £"
]

const MANUAL_FIELDS_DAILY = [
  {name: 'Number of Clinics', id: 'number-of-clinics'},
  {name: 'Avg EE Multiplier', id: 'avg-ee-multiplier'},
  {name: 'Total Number of EE Booked', id: 'total-number-of-ee-booked'},
  {name: 'Number of EE Booked for Next Year', id: 'number-of-ee-booked-for-next-year'},
  {name: 'Number of Dispensing Opportunities', id: 'number-of-disp-opportunities'},
  {name: "Number of Paid OCT's", id: 'number-of-paid-octs'},
  {name: 'Number of Contact Lens Signups', id: 'number-of-contact-lens-signups'},
  {name: 'Number of EyeCare Plan Signups', id: 'number-of-eyecare-plan-signups'},
  {name: 'Number of New EE Dispensed', id: 'number-of-new-ee-disp'}
]



function getConstsDaily(){
  return  { 
    manual_fields_daily: MANUAL_FIELDS_DAILY,
  }
}
