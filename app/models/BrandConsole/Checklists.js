import Fetch from '../../services/fetch/index'

const Checklists = {}

Checklists.getChecklists = async function (brand) {
  try {
    return await new Fetch()
      .get(`/brands/${brand}/checklists`)
  } catch (error) {
    return { error }
  }
}

Checklists.addChecklist = async function (brand, checklist) {
  try {
    return await new Fetch()
      .post(`/brands/${brand}/checklists`)
      .send(checklist)
  } catch (error) {
    return { error }
  }
}

Checklists.editChecklist = async function (checklist) {
  try {
    return await new Fetch()
      .put(`/brands/${checklist.brand}/checklists/${checklist.id}`)
      .send(checklist)
  } catch (error) {
    return { error }
  }
}

Checklists.deleteChecklist = async function (checklist) {
  try {
    return await new Fetch()
      .delete(`/brands/${checklist.brand}/checklists/${checklist.id}`)
  } catch (error) {
    return { error }
  }
}
export default Checklists
