import Fuse, { FuseOptions } from 'fuse.js'

import { Avatar } from '@material-ui/core'

import React from 'react'

import { getContactAttribute } from 'models/contacts/helpers/get-contact-attribute'

import { EmailRecipient, Recipient } from './types'
import { ChipInputItem, Suggestion } from '../ChipsInput/types'
import { idIsUUID } from '../Forms/MultipleContactsSelect/AddRecipient/helpers'

import ListIcon from '../SvgIcons/List/ListIcon'

import TagIcon from '../SvgIcons/Tag/TagIcon'
import { RecipientToString } from './RecipientToString'
import { validateRecipient } from './helpers/validate-recipient'

export function isContactList(input: any): input is IContactList {
  return (input as IContactList).type === 'contact_list'
}

export function isContactTag(input: Recipient): input is IContactTag {
  return (input as IContactTag).type === 'crm_tag'
}

export function isEmailRecipient(input: Recipient): input is EmailRecipient {
  return !!(input as EmailRecipient).email
}

const tagsFuseOptions: FuseOptions<IContactTag> = {
  keys: ['text'],
  threshold: 0.3
}
const listsFuseOptions: FuseOptions<IContactList> = {
  keys: ['name'],
  threshold: 0.3
}

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

export function recipientToChip(recipient: Recipient): ChipInputItem {
  const hasError = !!validateRecipient(recipient)

  if (isContactList(recipient)) {
    return {
      label: recipient.name,
      hasError
    }
  }

  if (isContactTag(recipient)) {
    return {
      label: recipient.text,
      hasError
    }
  }

  return {
    label: <RecipientToString recipient={recipient} />,
    hasError
  }
}

export function recipientToString(
  recipient: Recipient,
  emailAttributeDef: IContactAttributeDef
): string {
  if (isContactList(recipient)) {
    return `${recipient.name} (List)`
  }

  if (isContactTag(recipient)) {
    return `${recipient.text} (Tag)`
  }

  if (recipient.email) {
    if (!recipient.contact || !recipient.contact.display_name) {
      return recipient.email
    }

    // We have a contact here which has a display name.
    // if it has multiple emails, show email in parentheses. Otherwise, only name
    let emails: string[] = []

    try {
      emails = getContactAttribute(recipient.contact, emailAttributeDef).map(
        attr => attr.text
      )
    } catch (e) {
      console.error('[RecipientToString]: ', e)
    }

    const showEmail = emails.length > 1

    // if all other emails are for different domains, then it's sufficient
    // to show the domain only, like Gmail
    const onlyShowDomain = emails.every(
      anEmail =>
        anEmail === recipient.email ||
        getEmailDomain(anEmail) !== getEmailDomain(recipient.email)
    )

    return (
      recipient.contact.display_name +
      (showEmail
        ? ` (${recipient.email
            .split('@')
            .slice(onlyShowDomain ? 1 : 0)
            .join('@')})`
        : '')
    )
  }

  return ''
}

export function tagToSuggestion(tag: IContactTag) {
  return {
    title: tag.text,
    subtitle: 'Tag',
    avatar: (
      <Avatar>
        <TagIcon />
      </Avatar>
    ),
    data: tag
  }
}

export function listToSuggestion(list: IContactList) {
  return {
    title: list.name,
    subtitle: 'List',
    avatar: (
      <Avatar>
        <ListIcon color="currentColor" />
      </Avatar>
    ),
    data: list
  }
}

export function filterTags(
  tags: IContactTag[],
  searchTerm: string
): IContactTag[] {
  return new Fuse(tags.filter(idIsUUID), tagsFuseOptions)
    .search(searchTerm)
    .slice(0, 5)
}

export function filterLists(
  lists: IContactList[],
  searchTerm: string
): IContactList[] {
  return new Fuse(lists.filter(idIsUUID), listsFuseOptions)
    .search(searchTerm)
    .slice(0, 5)
}

function getEmailDomain(email) {
  return email.split('@')[1]
}
