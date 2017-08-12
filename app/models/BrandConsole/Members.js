import Fetch from '../../services/fetch/index'

const Members = {}

Members.getRoles = async function (user) {
  const endpoint = `/brands/${user.brand}/roles`
  try {
    const fetchRoles = new Fetch()
      .get(endpoint)
    return await fetchRoles
  } catch (e) {
    console.log(e)
  }
}

export default Members
