import { ShowingRoleInputPerson } from '../../types'

export function getPersonFromUser(user: IUser): ShowingRoleInputPerson {
  return {
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    email: user.email,
    phone_number: user.phone_number || '',
    user: user.id,
    brand: user.brand || ''
  }
}

const validRoles: IShowingRoleType[] = [
  'SellerAgent',
  'CoSellerAgent',
  'Tenant'
]

export function isValidShowingRoleType(
  role: IDealRoleType
): role is IShowingRoleType {
  return validRoles.includes(role as IShowingRoleType)
}
