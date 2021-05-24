import { useState, Dispatch, SetStateAction } from 'react'

import { NotificationTypeValue } from '../../components/ShowingRoleNotificationTypes'

import { YesNoAnswer } from '../../components/ShowingStepYesNoQuestion'
import useListingCancelNotificationTypes from './use-listing-cancel-notification-types'
import useListingConfirmNotificationTypes from './use-listing-confirm-notification-types'
import useListingPersonOnChange from './use-listing-person-on-change'

interface UseShowingRoleReturn {
  rolePerson: Nullable<IShowingRoleInputPerson>
  setRolePerson: Dispatch<SetStateAction<Nullable<IShowingRoleInputPerson>>>
  roleConfirmNotificationTypes: Nullable<[boolean, INotificationDeliveryType[]]>
  setRoleConfirmNotificationTypesChange: (value: NotificationTypeValue) => void
  roleCancelNotificationTypes: Nullable<[boolean, INotificationDeliveryType[]]>
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

  const [roleNotification, setRoleNotification] = useState<
    Nullable<IShowingRoleInputNotification>
  >(null)

  const [
    roleConfirmNotificationTypes,
    handleRoleConfirmNotificationTypesChange
  ] = useListingConfirmNotificationTypes(roleNotification, setRoleNotification)

  const [
    roleCancelNotificationTypes,
    handleRoleCancelNotificationTypesChange
  ] = useListingCancelNotificationTypes(roleNotification, setRoleNotification)

  const handleResetRoleNotification = () => {
    setRoleNotification(null)
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
