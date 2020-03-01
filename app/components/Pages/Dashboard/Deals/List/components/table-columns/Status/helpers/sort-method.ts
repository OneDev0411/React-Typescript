export const statusSortMethod = (accessor?: string | number | null) => {
  const list = [
    'Active',
    'Lease',
    'Pending',
    'Active Option Contract',
    'Active Contingent',
    'Active Kick Out',
    'Lease Contract',
    'Sold',
    'Leased',
    'Expired',
    'Temp Off Market',
    'Cancelled',
    'Withdrawn',
    'Contract Terminated'
  ]

  if (!accessor) {
    return list.length + 1
  }

  const order = list.indexOf(accessor.toString())

  return order > -1 ? order : list.length + 1
}
