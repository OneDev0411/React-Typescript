import fecha from 'fecha'

import { initialValueGenerator } from 'components/EventDrawer/helpers/initial-value-generator'
import { EmailThreadEmail } from 'components/EmailThread/types'
import { normalizeAssociations } from 'views/utils/association-normalizers'

import { FollowUpEmail } from '../types'

export default function getFollowUpEmailCrmTask(
  email: FollowUpEmail,
  dueDate: Date,
  user: IUser
) {
  if (!email) {
    return undefined
  }

  if ('type' in email && email.type === 'email_campaign') {
    return getCrmTaskFromEmailCampaign(email)
  }

  return getCrmTaskFromEmailThreadEmail(email as EmailThreadEmail)

  function getCrmTaskFromEmailCampaign(
    email: IEmailCampaign<
      IEmailCampaignAssociation,
      IEmailCampaignRecipientAssociation,
      IEmailCampaignEmailAssociation
    >
  ) {
    const owner = email.from.type === 'user' ? email.from : user
    const contactAssociations = email.recipients
      .filter(resp => resp.contact)
      .map(resp => ({
        contact: resp.contact,
        association_type: 'contact'
      }))
    const title = `Follow up with ${contactAssociations[0]?.contact.display_name}`
    const description = `This is a follow up reminder ${
      owner.display_name
    } set in Rechat, on ${fecha.format(
      email.due_at * 1000,
      'dddd MMMM Do, YYYY'
    )} for the attached email.`

    const values = initialValueGenerator(
      owner,
      normalizeAssociations([
        ...contactAssociations,
        {
          association_type: 'email',
          email
        }
      ]),
      dueDate,
      undefined,
      title,
      description
    )

    return values
  }

  function getCrmTaskFromEmailThreadEmail(email: EmailThreadEmail) {
    const owner = user
    const contactAssociations =
      email.thread?.contacts?.map?.(contact => ({
        contact,
        association_type: 'contact'
      })) || []
    const title = `Follow up with ${email.to[0]}`
    const description = `This is a follow up reminder ${
      owner.display_name
    } set in Rechat, on ${fecha.format(
      email.date,
      'dddd MMMM Do, YYYY'
    )} for the attached email.`

    const values = initialValueGenerator(
      owner,
      normalizeAssociations(contactAssociations),
      dueDate,
      undefined,
      title,
      description
    )

    return values
  }
}
