import Fetch from '../../../../services/fetch'

/**
 * get submission form
 */
export async function getSubmissionForm(task_id, last_revision) {
  try {
    const response = await new Fetch().get(
      `/tasks/${task_id}/submission/${last_revision}`
    )

    return response.body.data
  } catch (e) {
    return null
  }
}
