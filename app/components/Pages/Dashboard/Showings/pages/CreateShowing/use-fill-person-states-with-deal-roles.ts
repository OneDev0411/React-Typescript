import { Dispatch, SetStateAction, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { selectDealRoles } from 'selectors/deals'

import { ShowingPropertyType } from '../../types'

function getPersonFromUser(user: IUser): IShowingRoleInputPerson {
  return {
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    email: user.email,
    phone_number: user.phone_number || '',
    user: user.id,
    brand: user.brand || ''
  }
}

function useFillPersonStatesWithDealRoles(
  property: Nullable<ShowingPropertyType>,
  setAgentPerson: Dispatch<SetStateAction<Nullable<IShowingRoleInputPerson>>>,
  setCoAgentPerson: Dispatch<SetStateAction<Nullable<IShowingRoleInputPerson>>>,
  setOccupantPerson: Dispatch<SetStateAction<Nullable<IShowingRoleInputPerson>>>
): void {
  const dealRoles = useSelector(selectDealRoles)

  useEffect(() => {
    if (property?.type === 'deal') {
      const roles = property.deal.roles.map(role => dealRoles[role as any])

      roles.forEach(role => {
        if (!role) {
          return
        }

        if (role.role_type === 'Person') {
          switch (role.role) {
            case 'SellerAgent':
              setAgentPerson(getPersonFromUser(role.user))

              return
            case 'CoSellerAgent':
              setCoAgentPerson(getPersonFromUser(role.user))

              return

            case 'Tenant':
              setOccupantPerson(getPersonFromUser(role.user))
          }
        }
      })
    }
  }, [dealRoles, property, setAgentPerson, setCoAgentPerson, setOccupantPerson])
}

export default useFillPersonStatesWithDealRoles
