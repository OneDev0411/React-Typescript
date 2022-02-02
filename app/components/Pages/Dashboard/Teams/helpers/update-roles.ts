import { difference, differenceBy, differenceWith, isEqual } from 'lodash'

import { getBrands } from 'models/BrandConsole/Brands'
import Roles from 'models/BrandConsole/Roles'

export async function updateRoles(
  brand: IBrand,
  newRoles: IBrandRole[]
): Promise<IBrand> {
  const removedRoles = differenceBy(brand.roles, newRoles || [], 'id')
  const addedRoles = differenceBy(newRoles, brand.roles || [], 'id')
  const editedRoles = differenceWith(
    difference(newRoles, addedRoles),
    brand.roles || [],
    (role1, role2) => {
      return isEqual([...role1.acl].sort(), [...role2.acl].sort())
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
      await Roles.addRole(brand.id, role)
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
    return brand
  }

  return {
    ...(await getBrands(brand.id, false)).data,
    children: brand.children
  }
}
