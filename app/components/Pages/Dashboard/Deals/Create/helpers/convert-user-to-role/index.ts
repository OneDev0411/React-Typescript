import { IDealFormRole } from '../../types'

type BrandedUser = IUser & {
  brand_id?: UUID | null
}

export function convertUserAgentToRole(
  user: BrandedUser
): Partial<IDealFormRole> {
  const agents = user.agents || []

  return {
    agents,
    brand: user.brand_id,
    legal_first_name: user.first_name || '',
    legal_last_name: user.last_name || '',
    phone_number: user.phone_number || agents[0]?.work_phone,
    company_title: agents[0]?.office ? agents[0]?.office.name : '',
    email: user.email
  }
}
