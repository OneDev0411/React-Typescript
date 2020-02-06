import { toEntityAssociation } from 'utils/association-utils'

import Fetch from '../../../services/fetch'

export const defaultEmailThreadAssociations: IEmailThreadAssociations[] = [
  'messages',
  'contacts'
]

export interface IGetEmailThreadsFilters {
  start: number
  limit?: number
  is_read?: boolean
  has_attachments?: boolean
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

  'limit' in filters && (query.limit = filters.limit)
  'is_read' in filters && (query.is_read = filters.is_read)
  'has_attachments' in filters &&
    (query.has_attachments = filters.has_attachments)

  const response = await new Fetch().get('/emails/threads').query(query)

  return response.body.data
}
