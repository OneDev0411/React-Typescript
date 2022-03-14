import { ShowingRoleInputPerson } from '../../types'

export function getPersonFromDealRole(role: IDealRole): ShowingRoleInputPerson {
  return {
    first_name: role.legal_first_name ?? '',
    last_name: role.legal_last_name ?? '',
    email: role.email,
    phone_number: role.phone_number ?? '',
    user: role.user,
    brand: role.user?.brand ?? ''
  }
}

export function getPersonFromUser(user: IUser): ShowingRoleInputPerson {
  return {
    first_name: user.first_name ?? '',
    last_name: user.last_name ?? '',
    email: user.email,
    phone_number: user.phone_number ?? '',
    user,
    brand: user.brand ?? ''
  }
}

const validRoles: IShowingRoleType[] = [
  'Admin/Assistant',
  'SellerAgent',
  'CoSellerAgent',
  'Tenant',
  'Other'
]

export function isValidShowingRoleType(
  role: IDealRoleType
): role is IShowingRoleType {
  return validRoles.includes(role as IShowingRoleType)
}
