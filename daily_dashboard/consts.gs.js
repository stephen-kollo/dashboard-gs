const PUBLIC_GDRIVE_FOLDER = "1YUtsZWk-VAq8Po3CFiVHnsbK94onINYA"

const BRANCHES = [
  'Middleton',
  'Heald Green',
  'Heckmondwike',
  'Cheadle'
]

const BRANCHES_SHORT = [
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

const DAILY_DATABASE_COLUMNS = [
"Date",
"Branch",
"Number of Clinics",
"Number of Dispensing Opportunities",
"Total Sales £",
"Number of EE Completed",
"% Conv Rate - EE to Dispense",
"AVG Dispensed Value £",
"Number of Adult Eye Exams Booked",
"Number of CL Fittings",
"Average Clinic Value"
]

const WEEK_DAYS = [
  'Sunday',
  'Monday',
  'Tuesday', 
  'Wednesday', 
  'Thursday', 
  'Friday', 
  'Saturday'
]

const MANUAL_FIELDS_DAILY = [
  {name: 'Average Clinic Value', id: 'avg-clinic-value'},
  {name: 'Number of Clinics', id: 'number-of-clinics'},
  {name: 'Number of Dispensing Opportunities', id: 'number-of-disp-opportunities'}
]

function getConstsDaily(){
  return  { 
    branches_short: BRANCHES_SHORT,
    manual_fields_daily: MANUAL_FIELDS_DAILY,
  }
}

const COLUMN_LETTERS = [
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K'
]
