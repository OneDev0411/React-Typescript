import { difference, differenceBy, differenceWith, isEqual } from 'lodash'

import { ITeam, ITeamRole } from 'models/BrandConsole/types'
import Roles from 'models/BrandConsole/Roles'
import { getBrands } from 'models/BrandConsole/Brands'

export async function updateRoles(
  team: ITeam,
  newRoles: ITeamRole[]
): Promise<ITeam> {
  const removedRoles = differenceBy(team.roles, newRoles || [], 'id')
  const addedRoles = differenceBy(newRoles, team.roles || [], 'id')
  const editedRoles = differenceWith(
    difference(newRoles, addedRoles),
    team.roles || [],
    (role1, role2) => {
      return isEqual(role1.acl.sort(), role2.acl.sort())
    }
  )

  const removePromises = removedRoles.map(async role => {
    try {
      await Roles.deleteRole(role)
    } catch (e) {
      console.error(`Could not remove role ${role.role}`, e)
    }
  })

  const addPromises = addedRoles.map(async role => {
    try {
      await Roles.addRole(team.id, role)
    } catch (e) {
      console.error(`Could not add role ${role.role}`, e)
    }
  })

  const editPromises = editedRoles.map(async role => {
    try {
      await Roles.editRole(role)
    } catch (e) {
      console.error(`Could not edit role ${role.role}`, e)
    }
  })

  const allPromises = [...removePromises, ...addPromises, ...editPromises]

  await Promise.all(allPromises)

  if (!allPromises.length) {
    return team
  }

  return {
    ...(await getBrands(team.id, false)).data,
    children: team.children
  }
}
