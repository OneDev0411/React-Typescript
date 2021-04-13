import type { SetStateAction, Dispatch } from 'react'

import { NotificationTypeValue } from '../../components/ShowingRoleNotificationTypes'

type UseListingConfirmNotificationTypesReturn = [
  [boolean, INotificationDeliveryType[]],
  (value: NotificationTypeValue) => void
]

function useListingConfirmNotificationTypes(
  listingNotification: IShowingRoleInputNotification,
  setListingNotification: Dispatch<
    SetStateAction<IShowingRoleInputNotification>
  >
): UseListingConfirmNotificationTypesReturn {
  const value: [boolean, INotificationDeliveryType[]] = [
    listingNotification.can_approve,
    listingNotification.confirm_notification_type
  ]

  const onChange = ([canApprove, types]: NotificationTypeValue) =>
    setListingNotification(oldValue => ({
      ...oldValue,
      can_approve: canApprove,
      confirm_notification_type: types
    }))

  return [value, onChange]
}

export default useListingConfirmNotificationTypes
