import Fetch from '../../../services/fetch'

async function fetchContact(user, contactId) {
  const { access_token } = user

  if (!access_token) {
    throw new Error('Unauthorized access.')
  }

  if (!contactId) {
    throw new Error('Contact id is required.')
  }

  try {
    const fetchContact = new Fetch().get(`/contacts/${contactId}`)

    // required on ssr
    if (access_token) {
      fetchContact.set({ Authorization: `Bearer ${access_token}` })
    }

    const response = await fetchContact

    return response.body.data
  } catch (error) {
    throw error
  }
}

export default fetchContact
