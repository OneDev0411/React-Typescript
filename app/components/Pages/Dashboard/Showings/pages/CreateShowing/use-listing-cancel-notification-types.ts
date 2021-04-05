import type { SetStateAction, Dispatch } from 'react'

import { NotificationTypeValue } from '../../components/ShowingStepRoleNotificationTypes'

type UseListingCancelNotificationTypesReturn = [
  [boolean, INotificationDeliveryType[]],
  (value: NotificationTypeValue) => void
]

function useListingCancelNotificationTypes(
  listingNotification: IShowingRoleNotification,
  setListingNotification: Dispatch<SetStateAction<IShowingRoleNotification>>
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
