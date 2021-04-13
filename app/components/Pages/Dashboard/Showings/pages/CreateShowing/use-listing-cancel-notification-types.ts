import type { SetStateAction, Dispatch } from 'react'

import type { NotificationTypeValue } from '../../components/ShowingRoleNotificationTypes'

type UseListingCancelNotificationTypesReturn = [
  [boolean, INotificationDeliveryType[]],
  (value: NotificationTypeValue) => void
]

function useListingCancelNotificationTypes(
  listingNotification: IShowingRoleInputNotification,
  setListingNotification: Dispatch<
    SetStateAction<IShowingRoleInputNotification>
  >
): UseListingCancelNotificationTypesReturn {
  const value: [boolean, INotificationDeliveryType[]] = [
    false,
    listingNotification.cancel_notification_type
  ]

  const onChange = ([, types]: NotificationTypeValue) => {
    setListingNotification(oldValue => ({
      ...oldValue,
      cancel_notification_type: types
    }))
  }

  return [value, onChange]
}

export default useListingCancelNotificationTypes
