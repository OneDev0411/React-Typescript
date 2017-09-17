import Fetch from '../../services/fetch/index'

const Members = {}

Members.getMembers = async function (role) {
  const endpoint = `/brands/${role.brand}/roles/${role.id}/members`
  try {
    const fetchRoles = new Fetch()
      .get(endpoint)
    return await fetchRoles
  } catch (e) {
    console.log(e)
  }
}

Members.addMembers = async function (role, members) {
  try {
    return await new Fetch()
      .post(`/brands/${role.brand}/roles/${role.id}/members`)
      .send(members)
  } catch (error) {
    return { error }
  }
}

Members.deleteMember = async function (role, member_id) {
  try {
    return await new Fetch().delete(`/brands/${role.brand}/roles/${role.id}/members/${member_id}`)
  } catch (error) {
    return { error }
  }
}

export default Members
