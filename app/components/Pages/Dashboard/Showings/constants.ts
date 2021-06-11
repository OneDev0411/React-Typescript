import type { SelectItem } from 'components/Select'

import type { ShowingDetailTabType, ShowingsTabType } from './types'

export const showingDetailTabs: Record<
  ShowingDetailTabType,
  ShowingDetailTabType
> = {
  Bookings: 'Bookings',
  Visitors: 'Visitors',
  Settings: 'Settings'
}

export const showingsTabs: Record<ShowingsTabType, ShowingsTabType> = {
  Properties: 'Properties',
  Bookings: 'Bookings'
}

export const showingDurationOptions: SelectItem<number>[] = [
  { label: '15 minutes', value: 15 * 60 },
  { label: '30 minutes', value: 30 * 60 },
  { label: '1 hour', value: 60 * 60 }
]

export const goAndShowNotificationTypes: IShowingRoleInputNotification = {
  can_approve: true,
  confirm_notification_type: [],
  cancel_notification_type: []
}
