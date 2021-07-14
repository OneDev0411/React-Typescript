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
  const defaultStatus = StatusTypes[0].key

  if (!status) {
    return defaultStatus
  }

  return (
    StatusTypes.find(type => status[type.key] === true)?.key || defaultStatus
  )
}
