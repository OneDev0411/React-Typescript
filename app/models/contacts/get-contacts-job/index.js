import Fetch from '../../../services/fetch'

export async function getContactsJob(JobId) {
  if (!JobId) {
    throw new Error('Job id is required.')
  }

  try {
    const response = await new Fetch().get(`/contacts/jobs/${JobId}`)

    return response.body
  } catch (error) {
    throw error
  }
}
