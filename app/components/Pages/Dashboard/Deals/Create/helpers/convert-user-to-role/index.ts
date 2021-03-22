import { IDealFormRole } from '../../types'

type BrandedUser = IUser & {
  brand_id?: UUID | null
}

export function convertUserAgentToRole(
  user: BrandedUser
): Partial<IDealFormRole> {
  return {
    agent: user.agent,
    brand: user.brand_id,
    legal_first_name: user.first_name || '',
    legal_last_name: user.last_name || '',
    phone_number: user.phone_number || user.agent?.work_phone,
    company_title: user.agent?.office ? user.agent?.office.name : '',
    email: user.email
  }
}
