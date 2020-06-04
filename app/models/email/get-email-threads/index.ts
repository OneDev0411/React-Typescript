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

export async function getEmailThreads<
  SelectedEmailThreadAssociations extends IEmailThreadAssociations
>(
  filters: {
    selection?: typeof defaultEmailThreadSelection[number][]
    start: number
    limit?: number
    isRead?: boolean
    hasAttachments?: boolean
    ids?: UUID[]
  },
  associations: SelectedEmailThreadAssociations[] = defaultEmailThreadAssociations as SelectedEmailThreadAssociations[]
): Promise<IEmailThread<SelectedEmailThreadAssociations>[]> {
  const response = await new Fetch().post('/emails/threads/filter').query({
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
