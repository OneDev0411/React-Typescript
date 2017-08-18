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

Checklists.addChecklist = async function (user, checklist) {
  try {
    return await new Fetch()
      .post(`/brands/${user.brand}/checklists`)
      .send(checklist)
  } catch (e) {
    console.log(e)
  }
}

Checklists.deleteChecklist = async function (checklist) {
  try {
    return await new Fetch().delete(`/brands/${checklist.brand}/checklists/${checklist.id}`)
  } catch (e) {
    console.log(e)
  }
}
export default Checklists
