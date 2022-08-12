import fecha from 'fecha'

import { EmailThreadEmail } from 'components/EmailThread/types'
import { initialValueGenerator } from 'components/EventDrawer/helpers/initial-value-generator'
import { normalizeAssociations } from 'views/utils/association-normalizers'

import { Props as FollowUpProps } from '../FollowUpModal'
import { FollowUpEmail, FollowUpEmailCampaign } from '../types'

// TODO: should drop specific email association and make it general
export function getFollowUpCrmTask(
  email: FollowUpEmail | undefined,
  dueDate: Date,
  user: IUser,
  dictionary?: FollowUpProps['dictionary']
) {
  if (!email) {
    // return undefined
    const title = getCrmTaskTitle(undefined, dictionary?.taskTitle)
    const description = getCrmTaskDescription(
      user.display_name,
      dueDate,
      dictionary?.taskDescription
    )

    return initialValueGenerator(
      user,
      [],
      dueDate,
      undefined,
      title,
      description
    )
  }

  if ('type' in email && email.type === 'email_campaign') {
    return getCrmTaskFromEmailCampaign(email, dueDate, user, dictionary)
  }

  return getCrmTaskFromEmailThreadEmail(
    email as EmailThreadEmail,
    dueDate,
    user
  )
}

function getCrmTaskFromEmailCampaign(
  email: FollowUpEmailCampaign,
  dueDate: Date,
  user: IUser,
  dictionary?: FollowUpProps['dictionary']
) {
  const owner = email.from.type === 'user' ? email.from : user
  const contactAssociations = email.recipients
    .filter(resp => resp.contact)
    .map(resp => ({
      contact: resp.contact,
      association_type: 'contact'
    }))
  const title = getCrmTaskTitle(
    contactAssociations[0]?.contact.display_name,
    dictionary?.taskTitle,
    email
  )
  const description = getCrmTaskDescription(
    owner.display_name,
    email.due_at * 1000,
    dictionary?.taskDescription,
    email
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
  user: IUser,
  dictionary?: FollowUpProps['dictionary']
) {
  const owner = user
  const contactAssociations =
    email.thread?.contacts?.map?.(contact => ({
      contact,
      association_type: 'contact'
    })) || []
  const title = getCrmTaskTitle(email.to[0], dictionary?.taskTitle)
  const description = getCrmTaskDescription(
    owner.display_name,
    email.date,
    dictionary?.taskDescription
  )

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

// Todo: change this helper to be more general now it just accept email
export function getCrmTaskTitle(
  item?: string,
  getter?: (item?: string) => string,
  email?: FollowUpEmailCampaign
) {
  if (getter) {
    return getter(item)
  }

  let title = 'Follow up'

  if (email) {
    title = 'Follow up Email'

    const recipientType: IEmailRecipientType =
      email.recipients[0]?.recipient_type

    switch (recipientType) {
      case 'Email':
        return `${title}: ${
          email.recipients[0].contact?.display_name || email.recipients[0].email
        }`
      case 'Tag':
        return `${title}: ${email.recipients[0].tag}'s Tag`
      case 'AllContacts':
        return `${title}: All Contacts`
      default:
        return title
    }
  }

  if (item) {
    return `${title}: ${item}`
  }

  return title
}

// Todo: change this helper to be more general now it just accept email
export function getCrmTaskDescription(
  item: string,
  dueDate: Date | number,
  getter?: (item: string, dueDate: Date | number) => string,
  email?: FollowUpEmailCampaign
) {
  if (getter) {
    return getter(item, dueDate)
  }

  return `This is a follow up reminder ${item} set in Rechat, on ${fecha.format(
    dueDate,
    'dddd MMMM Do, YYYY'
  )} for the attached email.`
}
