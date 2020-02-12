import { toEntityAssociation } from 'utils/association-utils'

import Fetch from '../../../services/fetch'

export const defaultEmailThreadAssociations: IEmailThreadAssociations[] = [
  'messages',
  'contacts'
]

export interface IGetEmailThreadsFilters {
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
    'select[]': [
      'google_message.html_body',
      'microsoft_message.html_body',
      'email.html',
      'email.text'
    ],
    start: filters.start,
    limit: filters.limit,
    is_read: filters.isRead,
    has_attachments: filters.hasAttachments,
    'ids[]': filters.ids
  })

  return response.body.data
}
