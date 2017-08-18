import Fetch from '../../services/fetch/index'

const Checklists = {}

Checklists.getChecklists = async function (user) {
  try {
    return await new Fetch()
      .get(`/brands/${user.brand}/checklists`)
  } catch (e) {
    console.log(e)
  }
}

Checklists.addChecklist = async function (user, role) {
  try {
    return await new Fetch()
      .post(`/brands/${user.brand}/checklists`)
      .send(role)
  } catch (e) {
    console.log(e)
  }
}

Checklists.deleteRole = async function (role) {
  try {
    return await new Fetch().delete(`/brands/${role.brand}/checklists/${role.id}`)
  } catch (e) {
    console.log(e)
  }
}
export default Checklists
