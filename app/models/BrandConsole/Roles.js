import Fetch from '../../services/fetch/index'

const Roles = {}

Roles.getRoles = async function (user) {
  const endpoint = `/brands/${user.brand}/roles`
  try {
    const fetchRoles = new Fetch()
      .get(endpoint)
    return await fetchRoles
  } catch (e) {
    console.log(e)
  }
}

Roles.addRole = async function (user, role) {
  try {
    return await new Fetch()
      .post(`/brands/${user.brand}/roles`)
      .send(role)
  } catch (e) {
    console.log(e)
  }
}

Roles.deleteRole = async function (role) {
  try {
    return await new Fetch().delete(`/brands/${role.brand}/roles/${role.id}`)
  } catch (e) {
    console.log(e)
    return null
  }
}
export default Roles
