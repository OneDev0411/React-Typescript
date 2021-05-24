import type { SetStateAction, Dispatch } from 'react'

import { NotificationTypeValue } from '../../components/ShowingRoleNotificationTypes'

type UseListingConfirmNotificationTypesReturn = [
  Nullable<[boolean, INotificationDeliveryType[]]>,
  (value: NotificationTypeValue) => void
]

function useListingConfirmNotificationTypes(
  listingNotification: Nullable<IShowingRoleInputNotification>,
  setListingNotification: Dispatch<
    SetStateAction<IShowingRoleInputNotification>
  >
): UseListingConfirmNotificationTypesReturn {
  const value: Nullable<
    [boolean, INotificationDeliveryType[]]
  > = listingNotification
    ? [
        listingNotification.can_approve,
        listingNotification.confirm_notification_type
      ]
    : null

  const onChange = ([canApprove, types]: NotificationTypeValue) =>
    setListingNotification(oldValue => ({
      ...oldValue,
      can_approve: canApprove,
      confirm_notification_type: types
    }))

  return [value, onChange]
}

export default useListingConfirmNotificationTypes
