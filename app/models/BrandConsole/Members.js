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

Members.addMembers = async function(roomId, recipients) {
  try {
    return await new Fetch()
      .post(`/rooms/${roomId}/users`)
      .send(recipients)

  } catch (e) {
    return null
  }
}

export default Members
