import { uniq } from 'underscore'

import { toEntityAssociation } from 'utils/association-utils'

import Fetch from '../../../services/fetch'

export const defaultEmailThreadAssociations: IEmailThreadAssociations[] = [
  'messages',
  'contacts'
]
export const defaultEmailThreadSelection = <const>[
  'email_thread.snippet',
  'google_message.html_body',
  'microsoft_message.html_body',
  'email.html',
  'email.text'
]

export interface IGetEmailThreadsFilters {
  selection?: typeof defaultEmailThreadSelection[number][]
  searchQuery?: string
  start: number
  limit?: number
  isRead?: boolean
  hasAttachments?: boolean
  ids?: UUID[]
}

export async function getEmailThreads<
  SelectedEmailThreadAssociations extends IEmailThreadAssociations
>(
  filters: IGetEmailThreadsFilters,
  associations: SelectedEmailThreadAssociations[] = defaultEmailThreadAssociations as SelectedEmailThreadAssociations[]
): Promise<IEmailThread<SelectedEmailThreadAssociations>[]> {
  const response = await new Fetch().get('/emails/threads').query({
    'associations[]': associations.map(toEntityAssociation('email_thread')),
    'select[]': filters.selection
      ? uniq(filters.selection)
      : defaultEmailThreadSelection,
    start: filters.start,
    limit: filters.limit,
    is_read: filters.isRead,
    has_attachments: filters.hasAttachments,
    'ids[]': filters.ids
  })

  return response.body.data
}
