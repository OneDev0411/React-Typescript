import { useQuery } from '@app/hooks/query'

import { feedByAlert } from '../query-keys/alerts'

import { getAlertFeed } from './get-alert-feed'

export function useAlertFeed(
  alertId: UUID,
  alertRoomId: UUID,
  isOpen: boolean
) {
  return useQuery(
    feedByAlert(alertId, alertRoomId),
    () => getAlertFeed(alertId, alertRoomId),
    {
      enabled: isOpen
    }
  )
}
