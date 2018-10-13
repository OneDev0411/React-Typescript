import _ from 'underscore'

export function stateToAbbreviated(stateName) {
  return _.findKey(STATES, name => name === stateName)
}

export const STREET_PREFIX = ['SW', 'S', 'SE', 'E', 'NW', 'W', 'NE', 'N']

export const STATES = {
  AK: 'Alaska',
  AL: 'Alabama',
  AR: 'Arkansas',
  AZ: 'Arizona',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DC: 'District of Columbia',
  DE: 'Delaware',
  FL: 'Florida',
  GA: 'Georgia',
  HI: 'Hawaii',
  IA: 'Iowa',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  MA: 'Massachusetts',
  MD: 'Maryland',
  ME: 'Maine',
  MI: 'Michigan',
  MN: 'Minnesota',
  MO: 'Missouri',
  MS: 'Mississippi',
  MT: 'Montana',
  NC: 'North Carolina',
  ND: 'North Dakota',
  NE: 'Nebraska',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NV: 'Nevada',
  NY: 'New York',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PA: 'Pennsylvania',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VA: 'Virginia',
  VT: 'Vermont',
  WA: 'Washington',
  WI: 'Wisconsin',
  WV: 'West Virginia',
  WY: 'Wyoming'
}

export const STREET_SUFFIX = [
  'Alley',
  'Avenue',
  'Bend',
  'Bluff',
  'Boulevard',
  'Branch',
  'ByPass',
  'Circle',
  'Cliff',
  'Corner',
  'Court',
  'Cove',
  'Creek',
  'Crossing',
  'Drive',
  'Expy',
  'Extension',
  'Freeway',
  'Gardens',
  'Glen',
  'Grove',
  'Heights',
  'Highway',
  'Hill',
  'Hollow',
  'Junction',
  'Landing',
  'Lane',
  'Loop',
  'Manor',
  'Meadows',
  'Park',
  'Parkway',
  'Pass',
  'Path',
  'Pike',
  'Place',
  'Plaza',
  'Point',
  'Ridge',
  'Road',
  'Row',
  'Run',
  'Shore',
  'Springs',
  'Spur',
  'Square',
  'Street',
  'Terrace',
  'Trace',
  'Trail',
  'Valley',
  'View',
  'Village',
  'Ville',
  'Vista',
  'Walk',
  'Way'
]
