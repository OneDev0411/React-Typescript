import sortBy from 'lodash/sortBy'
import keyBy from 'lodash/keyBy'
import uniq from 'lodash/uniq'

import { getStatus } from 'models/Deal/helpers/context'

export function sortDealsStatus(rows: IDeal[], statuses: IDealStatus[]) {
  const statusesByLabel = keyBy(statuses, 'label')
  const activeStatuses = filterBy(statuses, 'is_active')
  const pendingStatuses = filterBy(statuses, 'is_pending')
  const archivedStatuses = filterBy(statuses, 'is_archived')

  return sortBy(rows, (deal: IDeal) => {
    const value = (getStatus(deal) || '').trim()
    const status = statusesByLabel[value]

    if (!status) {
      return 500
    }

    if (status.is_active) {
      return activeStatuses.indexOf(value) + 100
    }

    if (status.is_pending) {
      return pendingStatuses.indexOf(value) + 200
    }

    if (status.is_archived) {
      return archivedStatuses.indexOf(value) + 300
    }

    return 400
  })
}

function filterBy(
  statuses: IDealStatus[],
  flag: 'is_active' | 'is_pending' | 'is_archived'
): string[] {
  return uniq(
    statuses.filter(status => status[flag]).map(status => status.label)
  )
}
