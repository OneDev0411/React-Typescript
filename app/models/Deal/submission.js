import Fetch from '../../services/fetch'

/**
 * save submission
 */
export async function saveSubmission(id, form, state, values) {
  try {
    const response = await new Fetch().put(`/tasks/${id}/submission`).send({
      state,
      form,
      values
    })

    return response.body.data
  } catch (e) {
    throw e
  }
}

/**
 * get submission form
 */
export async function getSubmissionForm(task_id, last_revision) {
  try {
    const response = await new Fetch().get(`/tasks/${task_id}/submission/${last_revision}`)

    return response.body.data
  } catch (e) {
    return null
  }
}

export default {
  saveSubmission,
  getSubmissionForm
}
