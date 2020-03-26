import { uniq } from 'underscore'

import { toEntityAssociation } from 'utils/association-utils'

import Fetch from '../../../services/fetch'
import {
  defaultEmailThreadSelection,
  defaultEmailThreadAssociations
} from '../get-email-threads'

export interface SearchEmailThreadsNext {
  [credentialId: string]: string | null
}

export async function searchEmailThreads<
  SelectedEmailThreadAssociations extends IEmailThreadAssociations
>(
  filters: {
    selection?: typeof defaultEmailThreadSelection[number][]
    searchQuery: string
    next?: SearchEmailThreadsNext
  },
  associations: SelectedEmailThreadAssociations[] = defaultEmailThreadAssociations as SelectedEmailThreadAssociations[]
): Promise<{
  emailThreads: IEmailThread<SelectedEmailThreadAssociations>[]
  next: SearchEmailThreadsNext
}> {
  const response = await new Fetch()
    .post('/emails/threads/filter')
    .query({
      'associations[]': associations.map(toEntityAssociation('email_thread')),
      'select[]': filters.selection
        ? uniq(filters.selection)
        : defaultEmailThreadSelection,
      q: filters.searchQuery
    })
    .send({
      next: filters.next
    })

  return {
    emailThreads: response.body.data,
    next: response.body.info.next
  }
}
