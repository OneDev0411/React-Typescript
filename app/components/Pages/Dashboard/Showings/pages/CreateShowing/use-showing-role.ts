import { useState, Dispatch, SetStateAction } from 'react'

import { NotificationTypeValue } from '../../components/ShowingRoleNotificationTypes'

import { YesNoAnswer } from '../../components/ShowingStepYesNoQuestion'
import useListingCancelNotificationTypes from './use-listing-cancel-notification-types'
import useListingConfirmNotificationTypes from './use-listing-confirm-notification-types'
import useListingPersonOnChange from './use-listing-person-on-change'

const DEFAULT_NOTIFICATION_VALUE: IShowingRoleInputNotification = {
  can_approve: true,
  confirm_notification_type: [],
  cancel_notification_type: []
}

interface UseShowingRoleReturn {
  rolePerson: Nullable<IShowingRoleInputPerson>
  setRolePerson: Dispatch<SetStateAction<Nullable<IShowingRoleInputPerson>>>
  roleConfirmNotificationTypes: [boolean, INotificationDeliveryType[]]
  setRoleConfirmNotificationTypesChange: (value: NotificationTypeValue) => void
  roleCancelNotificationTypes: [boolean, INotificationDeliveryType[]]
  setRoleCancelNotificationTypesChange: (value: NotificationTypeValue) => void
  hasRole: Nullable<YesNoAnswer>
  setHasRoleChange: Dispatch<SetStateAction<YesNoAnswer>>
  resetRoleNotification: () => void
  editable: boolean
  setEditable: Dispatch<SetStateAction<boolean>>
}

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

  const handleResetRoleNotification = () => {
    setRoleNotification(DEFAULT_NOTIFICATION_VALUE)
  }

  const [editable, setEditable] = useState(false)

  return {
    rolePerson,
    setRolePerson,
    roleConfirmNotificationTypes,
    setRoleConfirmNotificationTypesChange: handleRoleConfirmNotificationTypesChange,
    roleCancelNotificationTypes,
    setRoleCancelNotificationTypesChange: handleRoleCancelNotificationTypesChange,
    hasRole,
    setHasRoleChange: handleHasRoleChange,
    resetRoleNotification: handleResetRoleNotification,
    editable,
    setEditable
  }
}

export default useShowingRole
