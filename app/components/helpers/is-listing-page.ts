import { isUUID } from '../../utils/validations/is-uuid/is-uuid'

export function isListingPage(id: UUID): boolean {
  if (
    id &&
    window &&
    window.location.pathname.includes('/dashboard/mls/') &&
    isUUID(id)
  ) {
    return true
  }

  return false
}
