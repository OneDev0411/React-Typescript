import Fetch from 'services/fetch'

type ICreateTeamRole = Pick<ITeamRole, 'acl' | 'role'>

async function getRoles(teamId: string) {
  const endpoint = `/brands/${teamId}/roles`

  try {
    const fetchRoles = new Fetch().get(endpoint)

    return await fetchRoles
  } catch (error) {
    return { error }
  }
}

async function addRole(teamId: string, role: ICreateTeamRole) {
  try {
    return await new Fetch().post(`/brands/${teamId}/roles`).send(role)
  } catch (error) {
    return { error }
  }
}

async function deleteRole(role: ITeamRole) {
  try {
    return await new Fetch().delete(`/brands/${role.brand}/roles/${role.id}`)
  } catch (error) {
    return { error }
  }
}

async function editRole(role: ITeamRole) {
  try {
    return await new Fetch()
      .put(`/brands/${role.brand}/roles/${role.id}`)
      .send(role)
  } catch (error) {
    return { error }
  }
}

export default {
  getRoles,
  addRole,
  editRole,
  deleteRole
}
