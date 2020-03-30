import { toEntityAssociation } from 'utils/association-utils'

import Fetch from '../../../services/fetch'

const DEFAULT_EMAIL_THREAD_ASSOCIATIONS: IEmailThreadAssociations[] = [
  'messages',
  'contacts'
]
export async function getEmailThread<A1 extends IEmailThreadAssociations>(
  threadKey: string,
  associations: A1[] = DEFAULT_EMAIL_THREAD_ASSOCIATIONS as A1[]
): Promise<IEmailThread<A1>> {
  const response = await new Fetch().get(`/emails/threads/${threadKey}`).query({
    associations: [...associations.map(toEntityAssociation('email_thread'))],
    select: [
      'google_message.html_body',
      'microsoft_message.html_body',
      'email.html',
      'email.text'
    ]
  })

  return response.body.data
}
