import { findInPeopleByEmail } from './find-in-people-by-email'
import { getPersonDisplayName } from './get-person-display-name'

export function getRecipientNameByEmail(
  recipients: (IContact | IAgent)[] | null,
  emailAddress: string | undefined
): string {
  return getPersonDisplayName(findInPeopleByEmail(recipients, emailAddress))
}
