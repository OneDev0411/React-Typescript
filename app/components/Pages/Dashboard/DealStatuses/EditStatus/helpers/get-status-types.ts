export const StatusTypes = [
  {
    key: 'is_active',
    label: 'Active'
  },
  {
    key: 'is_pending',
    label: 'Pending'
  },
  {
    key: 'is_archived',
    label: 'Archived'
  },
  {
    key: 'is_closed',
    label: 'Closed'
  }
]

export function getStatusActiveType(status: IDealStatus | undefined) {
  if (!status) {
    return null
  }

  return StatusTypes.find(type => status[type.key] === true)?.key
}
