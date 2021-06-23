import { useRef, useState } from 'react'
import { useSelector } from 'react-redux'

import { ACL } from 'constants/acl'

import { selectDealRoles } from 'selectors/deals'
import { selectActiveTeamId } from 'selectors/team'
import { getBrandUsers } from 'utils/user-teams'

import useActiveTeamBrandWithShowingsPermission from '../../hooks/use-active-team-brand-with-permission'

import {
  ShowingPropertyType,
  ShowingRoleInput,
  ShowingRoleInputPerson
} from '../../types'
import { getPersonFromUser, isValidShowingRoleType } from './helpers'

interface UseShowingRolesReturn {
  roles: ShowingRoleInput[]
  editRole: (role: ShowingRoleInput) => void
  addRole: (role: IShowingRoleType, roleId: UUID) => void
  deleteRole: (roleId: UUID) => void
  fillRolesWithPropertyRoles: (property: Nullable<ShowingPropertyType>) => void
}

function useShowingRoles(): UseShowingRolesReturn {
  const dealRoles = useSelector(selectDealRoles)
  const activeBrand = useActiveTeamBrandWithShowingsPermission(ACL.SHOWINGS)
  const teamMembers = activeBrand ? getBrandUsers(activeBrand) : []
  const teamId = useSelector(selectActiveTeamId)
  const nextRoleId = useRef<number>(1)

  const defaultRoles: ShowingRoleInput[] = [
    {
      id: 'role-0',
      role: 'SellerAgent',
      user: undefined,
      brand: teamId,
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      can_approve: true,
      confirm_notification_type: [],
      cancel_notification_type: [],
      deletable: false,
      mode: 'form'
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
      role,
      mode: 'form',
      deletable: true,
      can_approve: true,
      confirm_notification_type: [],
      cancel_notification_type: []
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
      const roles = property.deal.roles.map(role => dealRoles[role as any])

      roles.forEach(role => {
        if (!role) {
          return
        }

        if (role.role_type === 'Person' && isValidShowingRoleType(role.role)) {
          setRoleFromProperty(role.role, getPersonFromUser(role.user))
        }
      })
    } else if (property?.type === 'listing') {
      const user = teamMembers.find(
        user => user.agent?.email === property.listing.list_agent_email
      )

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
      brand: teamId,
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      can_approve: true,
      confirm_notification_type: [],
      cancel_notification_type: [],
      deletable: true,
      mode: 'form'
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
