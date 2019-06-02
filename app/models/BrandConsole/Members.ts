import { ITeamRole } from 'models/BrandConsole/types'

import Fetch from '../../services/fetch/index'

async function getMembers(role) {
  const endpoint = `/brands/${role.brand}/roles/${role.id}/members`

  try {
    const fetchRoles = new Fetch().get(endpoint)

    return await fetchRoles
  } catch (e) {
    console.log(e)
  }
}

interface IAddTeamMembers {
  users?: UUID[]
  emails?: string[]
  phone_numbers?: string[]
}

async function addMembers(
  brandId: string,
  roleId: string,
  members: IAddTeamMembers
) {
  try {
    return await new Fetch()
      .post(`/brands/${brandId}/roles/${roleId}/members`)
      .set('X-RECHAT-BRAND', brandId)
      .send(members)
  } catch (error) {
    return { error }
  }
}

async function deleteMember(role: ITeamRole, member_id: string) {
  try {
    return await new Fetch().delete(
      `/brands/${role.brand}/roles/${role.id}/members/${member_id}`
    )
  } catch (error) {
    return { error }
  }
}

export default {
  getMembers,
  addMembers,
  deleteMember
}
