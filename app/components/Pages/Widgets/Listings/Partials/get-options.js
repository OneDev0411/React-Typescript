export function getOptions(brokerage, agent, type, brandId, user, limit = 12) {
  const options = {
    limit,
    property_types: [
      'Residential',
      'Residential Lease',
      'Lots & Acreage',
      'Multi-Family'
    ],
    property_subtypes: [
      'RES-Single Family',
      'RES-Half Duplex',
      'RES-Farm/Ranch',
      'RES-Condo',
      'RES-Townhouse',
      'LSE-Apartment',
      'LSE-Condo/Townhome',
      'LSE-Duplex',
      'LSE-Fourplex',
      'LSE-House',
      'LSE-Mobile',
      'LSE-Triplex',
      'LND-Commercial',
      'LND-Farm/Ranch',
      'LND-Residential',
      'MUL-Full Duplex'
    ]
  }

  // These 'undefined' checks added because of this issue:
  // https://rechathq.slack.com/archives/C0TUXR9GQ/p1638973321493300

  if (brokerage && brokerage !== 'undefined') {
    options.list_offices = [brokerage]
  }

  if (agent && agent !== 'undefined') {
    options.agents = [agent]
  }

  if (brandId && brandId !== 'undefined') {
    options.brand = brandId
  }

  if (user) {
    options.access_token = user.access_token
  }

  if (type === 'sold') {
    options.listing_statuses = ['Sold', 'Leased']
  } else {
    options.listing_statuses = [
      'Active',
      'Active Contingent',
      'Active Kick Out',
      'Active Option Contract',
      'Pending'
    ]
  }

  return options
}
