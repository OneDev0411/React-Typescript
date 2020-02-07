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
  const query: any = {
    associations: [...associations.map(toEntityAssociation('email_thread'))],
    select: [
      'google_message.html_body',
      'microsoft_message.html_body',
      'email.html',
      'email.text'
    ],
    start: filters.start
  }

  if (filters.limit !== undefined) {
    query.limit = filters.limit
  }

  if (filters.isRead !== undefined) {
    query.is_read = filters.isRead
  }

  if (filters.hasAttachments !== undefined) {
    query.has_attachments = filters.hasAttachments
  }

  const body: any = {}

  if (filters.ids !== undefined) {
    body.ids = filters.ids
  }

  const response = await new Fetch()
    .get('/emails/threads')
    .query(query)
    .send(body)

  return response.body.data
}
