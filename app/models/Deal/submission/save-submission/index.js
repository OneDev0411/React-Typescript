import Fetch from '../../../../services/fetch'

/**
 * save submission
 */
export async function saveSubmission(id, pdf, form, values) {
  try {
    const response = await new Fetch().put(`/tasks/${id}/submission`).send({
      pdf,
      state: 'Fair',
      form,
      values
    })

    return response.body.data
  } catch (e) {
    throw e
  }
}
