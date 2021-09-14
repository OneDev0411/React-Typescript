import Fuse from 'fuse.js'
import { Observable } from 'rxjs'
import { fromPromise } from 'rxjs/observable/fromPromise'
import { of } from 'rxjs/observable/of'
import { map } from 'rxjs/operators'

import { searchContacts } from 'models/contacts/search-contacts'

export function getContactSuggestions(
  searchTerm: string
): Observable<IDenormalizedEmailRecipientEmailInput[]> {
  return searchTerm
    ? fromPromise(
        searchContacts(searchTerm, undefined, {
          associations: [],
          order: '-created_at'
        })
      ).pipe(
        map(result => {
          return new Fuse(
            result.data
              .map(contact => {
                const emails: string[] = (contact.emails || []).concat(
                  contact.partner_email || []
                )

                return emails.map<IDenormalizedEmailRecipientEmailInput>(
                  email => ({
                    recipient_type: 'Email',
                    contact,
                    email
                  })
                )
              })
              .flat(),
            {
              keys: ['email', 'contact.display_name']
            }
          ).search(searchTerm)
        })
      )
    : of([])
}
