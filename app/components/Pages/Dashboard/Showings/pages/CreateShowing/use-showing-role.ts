import { useState, Dispatch, SetStateAction } from 'react'

import { NotificationTypeValue } from '../../components/ShowingRoleNotificationTypes'

import { YesNoAnswer } from '../../components/ShowingStepYesNoQuestion'
import useListingCancelNotificationTypes from './use-listing-cancel-notification-types'
import useListingConfirmNotificationTypes from './use-listing-confirm-notification-types'
import useListingPersonOnChange from './use-listing-person-on-change'

const DEFAULT_NOTIFICATION_VALUE: IShowingRoleInputNotification = {
  can_approve: false,
  confirm_notification_type: [],
  cancel_notification_type: []
}

type UseShowingRoleReturn = [
  Nullable<IShowingRoleInputPerson>,
  Dispatch<SetStateAction<Nullable<IShowingRoleInputPerson>>>,
  [boolean, INotificationDeliveryType[]],
  (value: NotificationTypeValue) => void,
  [boolean, INotificationDeliveryType[]],
  (value: NotificationTypeValue) => void,
  Nullable<YesNoAnswer>,
  Dispatch<SetStateAction<YesNoAnswer>>
]

function useShowingRole(): UseShowingRoleReturn {
  const [hasRole, setHasRole] = useState<Nullable<YesNoAnswer>>(null)

  const [rolePerson, setRolePerson] = useState<
    Nullable<IShowingRoleInputPerson>
  >(null)

  const handleHasRoleChange = useListingPersonOnChange(
    setHasRole,
    setRolePerson
  )

  const [
    roleNotification,
    setRoleNotification
  ] = useState<IShowingRoleInputNotification>(DEFAULT_NOTIFICATION_VALUE)

  const [
    roleConfirmNotificationTypes,
    handleRoleConfirmNotificationTypesChange
  ] = useListingConfirmNotificationTypes(roleNotification, setRoleNotification)

  const [
    roleCancelNotificationTypes,
    handleRoleCancelNotificationTypesChange
  ] = useListingCancelNotificationTypes(roleNotification, setRoleNotification)

  return [
    rolePerson,
    setRolePerson,
    roleConfirmNotificationTypes,
    handleRoleConfirmNotificationTypesChange,
    roleCancelNotificationTypes,
    handleRoleCancelNotificationTypesChange,
    hasRole,
    handleHasRoleChange
  ]
}

export default useShowingRole
