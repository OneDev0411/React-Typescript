import { Suggestion } from '../../ChipsInput/types'
import { listToSuggestion } from './list-to-suggestion'
import { tagToSuggestion } from './tag-to-suggestion'

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
    const displayName = recipient.contact && recipient.contact.display_name

    return {
      title: displayName || recipient.email,
      subtitle: displayName !== recipient.email ? recipient.email : '',
      avatar: recipient.contact
        ? recipient.contact!.profile_image_url
        : undefined
    }
  }
}
