import { ShowingRoleInputPerson } from '../../types'

export function getPersonFromDealRole(role: IDealRole): ShowingRoleInputPerson {
  return {
    first_name: role.legal_first_name ?? '',
    last_name: role.legal_last_name ?? '',
    email: role.email,
    phone_number: role.phone_number ?? '',
    user: role.user?.id,
    brand: role.user?.brand ?? ''
  }
}

export function getPersonFromUser(
  user: IUser,
  selectedAgent?: IAgent
): ShowingRoleInputPerson {
  return selectedAgent
    ? {
        first_name: selectedAgent.first_name ?? '',
        last_name: selectedAgent.last_name ?? '',
        email: selectedAgent.email,
        phone_number: selectedAgent.phone_number ?? '',
        user: user.id,
        brand: user.brand ?? ''
      }
    : {
        first_name: user.first_name ?? '',
        last_name: user.last_name ?? '',
        email: user.email,
        phone_number: user.phone_number ?? '',
        user: user.id,
        brand: user.brand ?? ''
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
