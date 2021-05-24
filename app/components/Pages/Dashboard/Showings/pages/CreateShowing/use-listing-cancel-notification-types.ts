import type { SetStateAction, Dispatch } from 'react'

import type { NotificationTypeValue } from '../../components/ShowingRoleNotificationTypes'

type UseListingCancelNotificationTypesReturn = [
  Nullable<[boolean, INotificationDeliveryType[]]>,
  (value: NotificationTypeValue) => void
]

function useListingCancelNotificationTypes(
  listingNotification: Nullable<IShowingRoleInputNotification>,
  setListingNotification: Dispatch<
    SetStateAction<IShowingRoleInputNotification>
  >
): UseListingCancelNotificationTypesReturn {
  const value: Nullable<
    [boolean, INotificationDeliveryType[]]
  > = listingNotification
    ? [false, listingNotification.cancel_notification_type]
    : null

  const onChange = ([, types]: NotificationTypeValue) => {
    setListingNotification(oldValue => ({
      ...oldValue,
      cancel_notification_type: types
    }))
  }

  return [value, onChange]
}

export default useListingCancelNotificationTypes
