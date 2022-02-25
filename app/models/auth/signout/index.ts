import Fetch from 'services/fetch'

const signout = async (): Promise<unknown> => {
  try {
    const response = await new Fetch().post('/api/users/signout').send({})

    return response
  } catch ({ status }) {
    throw status
  }
}

export default signout
