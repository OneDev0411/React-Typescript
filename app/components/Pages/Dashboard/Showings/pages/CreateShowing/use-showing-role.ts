import { useState, Dispatch, SetStateAction } from 'react'

import { NotificationTypeValue } from '../../components/ShowingRoleNotificationTypes'

import { YesNoAnswer } from '../../components/ShowingStepYesNoQuestion'
import useListingCancelNotificationTypes from './use-listing-cancel-notification-types'
import useListingConfirmNotificationTypes from './use-listing-confirm-notification-types'
import useListingPersonOnChange from './use-listing-person-on-change'

const DEFAULT_NOTIFICATION_VALUE: IShowingRoleNotification = {
  can_approve: false,
  confirm_notification_type: [],
  cancel_notification_type: []
}

type UseShowingRoleReturn = [
  Nullable<YesNoAnswer>,
  Dispatch<SetStateAction<YesNoAnswer>>,
  Nullable<IShowingRolePerson>,
  Dispatch<SetStateAction<Nullable<IShowingRolePerson>>>,
  [boolean, INotificationDeliveryType[]],
  (value: NotificationTypeValue) => void,
  [boolean, INotificationDeliveryType[]],
  (value: NotificationTypeValue) => void
]

function useShowingRole(): UseShowingRoleReturn {
  const [hasRole, setHasRole] = useState<Nullable<YesNoAnswer>>(null)

  const [rolePerson, setRolePerson] = useState<Nullable<IShowingRolePerson>>(
    null
  )

  const handleHasRoleChange = useListingPersonOnChange(
    setHasRole,
    setRolePerson
  )

  const [
    roleNotification,
    setRoleNotification
  ] = useState<IShowingRoleNotification>(DEFAULT_NOTIFICATION_VALUE)

  const [
    roleConfirmNotificationTypes,
    handleRoleConfirmNotificationTypesChange
  ] = useListingConfirmNotificationTypes(roleNotification, setRoleNotification)

  const [
    roleCancelNotificationTypes,
    handleRoleCancelNotificationTypesChange
  ] = useListingCancelNotificationTypes(roleNotification, setRoleNotification)

  return [
    hasRole,
    handleHasRoleChange,
    rolePerson,
    setRolePerson,

    roleConfirmNotificationTypes,
    handleRoleConfirmNotificationTypesChange,
    roleCancelNotificationTypes,
    handleRoleCancelNotificationTypesChange
  ]
}

export default useShowingRole
