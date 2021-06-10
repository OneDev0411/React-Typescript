import { Dispatch, SetStateAction } from 'react'
import { useSelector } from 'react-redux'

import { selectDealRoles } from 'selectors/deals'
import { getBrandUsers } from 'utils/user-teams'

import useActiveTeamBrandWithShowingsPermission from '../../hooks/use-active-team-brand-with-showings-permission'

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

function useFillPersonRolesWithProperty(
  setProperty: Dispatch<SetStateAction<Nullable<ShowingPropertyType>>>,
  setAgentEditable: Dispatch<SetStateAction<boolean>>,
  setAgentPerson: Dispatch<SetStateAction<Nullable<IShowingRoleInputPerson>>>,
  setCoAgentEditable: Dispatch<SetStateAction<boolean>>,
  setCoAgentPerson: Dispatch<SetStateAction<Nullable<IShowingRoleInputPerson>>>,
  setOccupantEditable: Dispatch<SetStateAction<boolean>>,
  setOccupantPerson: Dispatch<SetStateAction<Nullable<IShowingRoleInputPerson>>>
): Dispatch<SetStateAction<Nullable<ShowingPropertyType>>> {
  const dealRoles = useSelector(selectDealRoles)
  const activeBrand = useActiveTeamBrandWithShowingsPermission()
  const teamMembers = activeBrand ? getBrandUsers(activeBrand) : []

  return (property: Nullable<ShowingPropertyType>) => {
    setAgentEditable(true)
    setCoAgentEditable(true)
    setOccupantEditable(true)

    if (property?.type === 'deal') {
      const roles = property.deal.roles.map(role => dealRoles[role as any])

      roles.forEach(role => {
        if (!role) {
          return
        }

        if (role.role_type === 'Person') {
          switch (role.role) {
            case 'SellerAgent':
              setAgentEditable(false)
              setAgentPerson(getPersonFromUser(role.user))

              return
            case 'CoSellerAgent':
              setCoAgentEditable(false)
              setCoAgentPerson(getPersonFromUser(role.user))

              return

            case 'Tenant':
              setOccupantEditable(false)
              setOccupantPerson(getPersonFromUser(role.user))
          }
        }
      })
    } else if (property?.type === 'listing') {
      const user = teamMembers.find(
        user => user.agent?.email === property.listing.list_agent_email
      )

      if (user) {
        setAgentEditable(false)
        setAgentPerson(getPersonFromUser(user))
      }
    }

    setProperty(property)
  }
}

export default useFillPersonRolesWithProperty
