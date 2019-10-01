import { Observable } from 'rxjs'
import { of } from 'rxjs/observable/of'

import { filterEntities } from './filter-entities'

export function getListSuggestions(
  lists: IContactList[],
  searchTerm: string
): Observable<IDenormalizedEmailRecipientListInput[]> {
  return of(
    filterEntities(lists, searchTerm, ['name']).map(list => ({
      recipient_type: 'List',
      list
    }))
  )
}
