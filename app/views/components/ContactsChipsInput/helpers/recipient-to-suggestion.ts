import { Recipient } from '../types'
import { Suggestion } from '../../ChipsInput/types'
import { listToSuggestion } from './list-to-suggestion'
import { tagToSuggestion } from './tag-to-suggestion'
import { isContactList } from './is-contact-list'
import { isContactTag } from './is-contact-tag'

export function recipientToSuggestion(recipient: Recipient): Suggestion {
  if (isContactList(recipient)) {
    return listToSuggestion(recipient)
  }

  if (isContactTag(recipient)) {
    return tagToSuggestion(recipient)
  }

  const displayName =
    recipient.contact &&
    recipient.contact.summary &&
    recipient.contact.summary.display_name

  return {
    title: displayName || recipient.email,
    subtitle: displayName ? recipient.email : '',
    avatar:
      recipient.contact && recipient.contact.summary
        ? recipient.contact.summary!.profile_image_url
        : undefined
  }
}
