import { IDealFormRole } from '../../types'

export function convertUserAgentToRole(
  user: IUser,
  isOfficeDoubleEnded: boolean
): Partial<IDealFormRole> {
  return {
    agent: user.agent,
    brand: isOfficeDoubleEnded ? null : user.brand_id,
    legal_first_name: user.first_name || '',
    legal_last_name: user.last_name || '',
    phone_number: user.phone_number || user.agent?.work_phone,
    company_title: user.agent?.office ? user.agent?.office.name : '',
    email: user.email
  }
}
