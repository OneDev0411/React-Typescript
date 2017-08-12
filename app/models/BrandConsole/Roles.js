import Fetch from '../../services/fetch/index'

const Roles = {}

Roles.getMembers = async function (role) {
  const endpoint = `/brands/${role.brand}/roles/${role.id}/members`
  try {
    const fetchRoles = new Fetch()
      .get(endpoint)
    return await fetchRoles
  } catch (e) {
    console.log(e)
  }
}

export default Roles
