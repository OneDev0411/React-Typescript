import { Observable } from 'rxjs'
import { of } from 'rxjs/observable/of'

import { filterEntities } from './filter-entities'

/**
 * Given a list of deal roles, returns an observable  of email recipient
 * suggestions
 */
export function getDealRoleSuggestions(
  dealRoles: IDealRole[],
  searchTerm: string
): Observable<IDenormalizedEmailRecipientEmailInput[]> {
  return of(
    filterEntities(dealRoles.filter(dealRole => dealRole.email), searchTerm, [
      'email',
      'legal_full_name',
      'user.display_name' as any // typing is not supported for nested casess
    ]).map(role => ({
      recipient_type: 'Email',
      email: role.email
    }))
  )
}
