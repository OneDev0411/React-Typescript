import { useRef, useState } from 'react'

import { useSelector } from 'react-redux'

import { useActiveBrandId } from '@app/hooks/brand/use-active-brand-id'
import { ACL } from 'constants/acl'
import { selectDealRoles } from 'selectors/deals'
import { getBrandUsers } from 'utils/user-teams'

import useActiveTeamBrandWithPermission from '../../hooks/use-active-team-brand-with-permission'
import {
  ShowingPropertyType,
  ShowingRoleInput,
  ShowingRoleInputPerson
} from '../../types'

import {
  getPersonFromDealRole,
  getPersonFromUser,
  isValidShowingRoleType
} from './helpers'

interface UseShowingRolesReturn {
  roles: ShowingRoleInput[]
  editRole: (role: ShowingRoleInput) => void
  addRole: (role: IShowingRoleType, roleId: UUID) => void
  deleteRole: (roleId: UUID) => void
  fillRolesWithPropertyRoles: (property: Nullable<ShowingPropertyType>) => void
}

function useShowingRoles(): UseShowingRolesReturn {
  const dealRoles = useSelector(selectDealRoles)
  const activeBrand = useActiveTeamBrandWithPermission(ACL.SHOWINGS)
  const teamMembers = activeBrand ? getBrandUsers(activeBrand) : []
  const activeBrandId = useActiveBrandId()
  const nextRoleId = useRef<number>(1)

  const defaultRoles: ShowingRoleInput[] = [
    {
      id: 'role-0',
      role: 'SellerAgent',
      user: undefined,
      agent: undefined,
      brand: activeBrandId,
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      can_approve: true,
      confirm_notification_type: [],
      cancel_notification_type: [],
      deletable: false,
      mode: 'form',
      save_to_contact: true
    }
  ]

  const [roles, setRoles] = useState<ShowingRoleInput[]>(defaultRoles)

  const setRoleFromProperty = (
    role: IShowingRoleType,
    person: ShowingRoleInputPerson
  ) => {
    const index = roles.findIndex(r => r.role === role)

    const newRoles = [...roles]

    const newRole: ShowingRoleInput = {
      id: `role-${nextRoleId.current++}`,
      ...person,
      agent:
        person.user?.agents?.length === 1 ? person.user.agents[0] : undefined,
      role,
      mode: 'form',
      deletable: role !== 'SellerAgent',
      can_approve: true,
      confirm_notification_type: [],
      cancel_notification_type: [],
      save_to_contact: true
    }

    if (index === -1) {
      newRoles.push(newRole)
    } else {
      newRoles.splice(index, 1, newRole)
    }

    setRoles(newRoles)
  }

  const fillRolesWithPropertyRoles = (
    property: Nullable<ShowingPropertyType>
  ) => {
    if (property?.type === 'deal') {
      const roles = property.deal.roles.map(role => dealRoles[role])

      roles.forEach(role => {
        if (!role) {
          return
        }

        if (role.role_type === 'Person' && isValidShowingRoleType(role.role)) {
          setRoleFromProperty(role.role, getPersonFromDealRole(role))
        }
      })
    } else if (property?.type === 'listing') {
      const user = teamMembers.find(user => {
        if (!user.agents) {
          return false
        }

        return user.agents.some(
          agent => agent.email === property.listing.list_agent_email
        )
      })

      if (user) {
        setRoleFromProperty('SellerAgent', getPersonFromUser(user))
      }
    }
  }

  const editRole = (role: ShowingRoleInput) => {
    const index = roles.findIndex(r => r.id === role.id)

    if (index === -1) {
      return
    }

    const newRoles = [...roles]

    newRoles.splice(index, 1, role)

    setRoles(newRoles)
  }

  const addRole = (role: IShowingRoleType, roleId: UUID) => {
    const index = roles.findIndex(r => r.id === roleId)

    if (index === -1) {
      return
    }

    const newRoles = [...roles]

    const newRole: ShowingRoleInput = {
      id: `role-${nextRoleId.current++}`,
      role,
      user: undefined,
      agent: undefined,
      brand: activeBrandId,
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      can_approve: true,
      confirm_notification_type: [],
      cancel_notification_type: [],
      deletable: true,
      mode: 'form',
      save_to_contact: true
    }

    newRoles.splice(index + 1, 0, newRole)

    setRoles(newRoles)
  }

  const deleteRole = (roleId: UUID) => {
    const index = roles.findIndex(r => r.id === roleId)

    if (index === -1) {
      return
    }

    const newRoles = [...roles]

    newRoles.splice(index, 1)

    setRoles(newRoles)
  }

  return {
    roles,
    editRole,
    addRole,
    deleteRole,
    fillRolesWithPropertyRoles
  }
}

export default useShowingRoles
