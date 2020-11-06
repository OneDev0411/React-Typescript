import { Suggestion } from '../../ChipsInput/types'
import { listToSuggestion } from './list-to-suggestion'
import { tagToSuggestion } from './tag-to-suggestion'
import { getDisplayNameForContactEmail } from './get-display-name-for-contact-email'

export function recipientToSuggestion(
  recipient: IDenormalizedEmailRecipientInput
): Suggestion | undefined {
  if (recipient.recipient_type === 'List') {
    return listToSuggestion({
      recipient_type: 'List',
      list: recipient.list
    })
  }

  if (recipient.recipient_type === 'Tag') {
    return tagToSuggestion(recipient)
  }

  if (recipient.recipient_type === 'Email') {
    const displayName =
      recipient.contact &&
      getDisplayNameForContactEmail(recipient.email, recipient.contact)

    const title = displayName || recipient.email

    return {
      title,
      subtitle: displayName !== recipient.email ? recipient.email : '',
      defaultAvatarProps: {
        title,
        url: (recipient.contact && recipient.contact.profile_image_url) || ''
      }
    }
  }

  if (recipient.recipient_type === 'Agent') {
    const title = recipient.agent.full_name || recipient.agent.email
    const subtitle = recipient.agent.full_name

    return {
      title,
      subtitle
    }
  }
}
