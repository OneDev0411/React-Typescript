import Fetch from '../services/fetch'

const BrandConsole = {}

BrandConsole.getRoles = async function (user) {
  const endpoint = `/brands/${user.brand}/roles`
  try {
    const fetchRoles = new Fetch()
      .get(endpoint)

    return await fetchRoles
  } catch (e) {
    console.log(e)
  }
}

BrandConsole.getMembers = async function (role) {
  const endpoint = `/brands/${role.brand}/roles/${role.id}/members`
  try {
    const fetchRoles = new Fetch()
      .get(endpoint)
    return await fetchRoles
  } catch (e) {
    console.log(e)
  }
}

export default BrandConsole
