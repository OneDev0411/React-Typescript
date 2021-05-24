import { useState, Dispatch, SetStateAction } from 'react'

import { YesNoAnswer } from '../../components/ShowingStepYesNoQuestion'
import useListingPersonOnChange from './use-listing-person-on-change'

interface UseShowingRoleReturn {
  rolePerson: Nullable<IShowingRoleInputPerson>
  setRolePerson: Dispatch<SetStateAction<Nullable<IShowingRoleInputPerson>>>
  roleCanApprove: Nullable<boolean>
  setRoleCanApprove: Dispatch<SetStateAction<boolean>>
  roleConfirmNotificationTypes: Nullable<INotificationDeliveryType[]>
  setRoleConfirmNotificationTypes: (value: INotificationDeliveryType[]) => void
  roleCancelNotificationTypes: Nullable<INotificationDeliveryType[]>
  setRoleCancelNotificationTypes: (value: INotificationDeliveryType[]) => void
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

  const [roleCanApprove, setRoleCanApprove] = useState<Nullable<boolean>>(null)

  const [
    roleConfirmNotificationTypes,
    setRoleConfirmNotificationTypes
  ] = useState<Nullable<INotificationDeliveryType[]>>(null)

  const [
    roleCancelNotificationTypes,
    setRoleCancelNotificationTypes
  ] = useState<Nullable<INotificationDeliveryType[]>>(null)

  const handleResetRoleNotification = () => {
    setRoleCanApprove(null)
    setRoleConfirmNotificationTypes(null)
    setRoleCancelNotificationTypes(null)
  }

  const [editable, setEditable] = useState(false)

  return {
    rolePerson,
    setRolePerson,
    roleCanApprove,
    setRoleCanApprove,
    roleConfirmNotificationTypes,
    setRoleConfirmNotificationTypes,
    roleCancelNotificationTypes,
    setRoleCancelNotificationTypes,
    hasRole,
    setHasRoleChange: handleHasRoleChange,
    resetRoleNotification: handleResetRoleNotification,
    editable,
    setEditable
  }
}

export default useShowingRole
