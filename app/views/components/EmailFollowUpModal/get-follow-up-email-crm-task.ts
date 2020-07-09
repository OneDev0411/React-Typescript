import fecha from 'fecha'

import { initialValueGenerator } from 'components/EventDrawer/helpers/initial-value-generator'
import { EmailThreadEmail } from 'components/EmailThread/types'
import { normalizeAssociations } from 'views/utils/association-normalizers'

import { FollowUpEmail } from './types'

export function getFollowUpEmailCrmTask(
  email: FollowUpEmail,
  dueDate: Date,
  user: IUser
) {
  if (!email) {
    return undefined
  }

  if ('type' in email && email.type === 'email_campaign') {
    return getCrmTaskFromEmailCampaign(email, dueDate, user)
  }

  return getCrmTaskFromEmailThreadEmail(
    email as EmailThreadEmail,
    dueDate,
    user
  )
}

function getCrmTaskFromEmailCampaign(
  email: IEmailCampaign<
    IEmailCampaignAssociation,
    IEmailCampaignRecipientAssociation,
    IEmailCampaignEmailAssociation
  >,
  dueDate: Date,
  user: IUser
) {
  const owner = email.from.type === 'user' ? email.from : user
  const contactAssociations = email.recipients
    .filter(resp => resp.contact)
    .map(resp => ({
      contact: resp.contact,
      association_type: 'contact'
    }))
  const title = getCrmTaskTitle(contactAssociations[0]?.contact.display_name)
  const description = getCrmTaskDescription(
    owner.display_name,
    email.due_at * 1000
  )

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

function getCrmTaskFromEmailThreadEmail(
  email: EmailThreadEmail,
  dueDate: Date,
  user: IUser
) {
  const owner = user
  const contactAssociations =
    email.thread?.contacts?.map?.(contact => ({
      contact,
      association_type: 'contact'
    })) || []
  const title = getCrmTaskTitle(email.to[0])
  const description = getCrmTaskDescription(owner.display_name, email.date)

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

function getCrmTaskTitle(name?: string) {
  let title = 'Follow up'

  if (name) {
    return `${title} with ${name}`
  }

  return title
}

function getCrmTaskDescription(name: string, dueDate: Date | number) {
  return `This is a follow up reminder ${name} set in Rechat, on ${fecha.format(
    dueDate,
    'dddd MMMM Do, YYYY'
  )} for the attached email.`
}
