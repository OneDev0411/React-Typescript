export const valertOptions = {
  open_house: false,
  listing_statuses: [
    'Active',
    'Sold',
    'Pending',
    'Active Kick Out',
    'Active Contingent',
    'Active Option Contract'
  ],
  minimum_sold_date: (new Date().getTime() + 90 * 24 * 3600000) / 1000,
  property_types: ['Residential'],
  property_subtypes: [
    'RES-Condo',
    'RES-Farm/Ranch',
    'RES-Half Duplex',
    'RES-Townhouse',
    'RES-Single Family'
  ]
}
