import { Observable } from 'rxjs'
import { of } from 'rxjs/observable/of'

import { filterEntities } from './filter-entities'

export function getTagSuggestions(
  tags: IContactTag[],
  searchTerm: string
): Observable<IDenormalizedEmailRecipientTagInput[]> {
  return of(
    filterEntities(tags, searchTerm, ['text']).map(tag => ({
      recipient_type: 'Tag',
      tag
    }))
  )
}
