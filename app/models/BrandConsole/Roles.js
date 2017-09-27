import Fetch from '../../services/fetch/index'

const Roles = {}

Roles.getRoles = async function (brand) {
  const endpoint = `/brands/${brand}/roles`
  try {
    const fetchRoles = new Fetch()
      .get(endpoint)
    return await fetchRoles
  } catch (error) {
    return { error }
  }
}

Roles.addRole = async function (brand, role) {
  try {
    return await new Fetch()
      .post(`/brands/${brand}/roles`)
      .send(role)
  } catch (error) {
    return { error }
  }
}

Roles.deleteRole = async function (role) {
  try {
    return await new Fetch().delete(`/brands/${role.brand}/roles/${role.id}`)
  } catch (error) {
    return { error }
  }
}

Roles.editRole = async function (role) {
  try {
    return await new Fetch()
      .put(`/brands/${role.brand}/roles/${role.id}`)
      .send(role)
  } catch (error) {
    return { error }
  }
}

export default Roles
