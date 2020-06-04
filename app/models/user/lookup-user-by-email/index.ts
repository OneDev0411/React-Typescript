import Fetch from '../../../services/fetch'

interface ResponseData {
  type: 'sso_provider'
  id: UUID
  created_at: number
  updated_at: number
  deleted_at: null | number
  name: string
  url: string
}

interface ResponseInfo {
  password: boolean
  is_shadow: boolean
  phone_confirmed: boolean
  email_confirmed: boolean
  fake_email: boolean
  count: number
  total: number
}

interface ResponseBody {
  code: string
  data: [] | ResponseData[]
  info: ResponseInfo
}

interface UserLookup {
  password: boolean
  email_confirmed: boolean
  phone_confirmed: boolean
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
    info: { password, is_shadow, email_confirmed, phone_confirmed }
  } = response.body as ResponseBody

  if (Array.isArray(data) && data.length === 1) {
    return {
      sso_url: data[0].url,
      password,
      is_shadow,
      email_confirmed,
      phone_confirmed
    }
  }

  return { password, is_shadow, email_confirmed, phone_confirmed }
}
