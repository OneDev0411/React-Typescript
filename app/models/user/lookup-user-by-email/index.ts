import Fetch from '../../../services/fetch'

interface UserLookup {
  password: boolean
  is_shadow: boolean
  sso_url?: string
}

export async function lookUpUserByEmail(email: string): Promise<UserLookup> {
  const response = await new Fetch({ proxy: true })
    .post('/users/lookup')
    .set({ 'x-auth-mode': 'client_id' })
    .send({ email })

  const {
    data,
    info: { password, is_shadow }
  } = response.body

  if (Array.isArray(data) && data.length === 1) {
    return { sso_url: data[0].url, password, is_shadow }
  }

  return { password, is_shadow }
}
