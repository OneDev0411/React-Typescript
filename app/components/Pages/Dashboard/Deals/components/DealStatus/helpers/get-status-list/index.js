import { getField } from 'models/Deal/helpers/context'

export function getStatusList(deal, isBackOffice) {
  if (getField(deal, 'contract_status')) {
    return getContractStatusList(deal, isBackOffice)
  }

  return getListingStatusList(deal, isBackOffice)
}

function isLease(deal) {
  return deal.property_type.includes('Lease')
}

function getListingStatusList(deal, isBackOffice) {
  if (isLease(deal)) {
    return isBackOffice
      ? ['Active', 'Temp Off Market', 'Leased', 'Expired', 'Cancelled']
      : ['Leased']
  }

  return isBackOffice
    ? [
        'Coming Soon',
        'Active',
        'Sold',
        'Pending',
        'Temp Off Market',
        'Active Option Contract',
        'Active Contingent',
        'Active Kick Out',
        'Withdrawn',
        'Expired',
        'Cancelled'
      ]
    : [
        'Coming Soon',
        'Pending',
        'Active Option Contract',
        'Active Contingent',
        'Active Kick Out'
      ]
}

function getContractStatusList(deal, isBackOffice) {
  if (isLease(deal)) {
    return isBackOffice
      ? ['Contract Terminated', 'Leased', 'Lease Contract']
      : ['Lease Contract']
  }

  return isBackOffice
    ? [
        'Active Option Contract',
        'Active Contingent',
        'Active Kick Out',
        'Pending',
        'Sold',
        'Contract Terminated'
      ]
    : [
        'Active Option Contract',
        'Active Contingent',
        'Active Kick Out',
        'Pending',
        'Sold'
      ]
}
