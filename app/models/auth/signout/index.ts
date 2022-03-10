import Fetch from 'services/fetch'

const signout = async (): Promise<unknown> => {
  return new Fetch().post('/api/users/signout').send({})
}

export default signout
