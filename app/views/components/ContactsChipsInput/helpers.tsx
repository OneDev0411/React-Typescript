import Fuse, { FuseOptions } from 'fuse.js'

import { Avatar } from '@material-ui/core'

import React from 'react'

import { Recipient } from './types'
import { ChipInputItem, Suggestion } from '../ChipsInput/types'
import { idIsUUID } from '../Forms/MultipleContactsSelect/AddRecipient/helpers'

import ListIcon from '../SvgIcons/List/ListIcon'

import TagIcon from '../SvgIcons/Tag/TagIcon'

export function isContactList(input: any): input is IContactList {
  return input.type === 'contact_list'
}

export function isContactTag(input: any): input is IContactTag {
  return input.type === 'crm_tag'
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

  return {
    title: recipient.email,
    subtitle:
      recipient.contact &&
      recipient.contact.summary &&
      recipient.contact.summary.display_name,
    avatar:
      recipient.contact && recipient.contact.summary
        ? recipient.contact.summary!.profile_image_url
        : undefined
  }
}

export function recipientToChip(recipient: Recipient): ChipInputItem {
  if (isContactList(recipient)) {
    return {
      text: recipient.name
    }
  }

  if (isContactTag(recipient)) {
    return {
      text: recipient.text
    }
  }

  // TODO handle logic chip text, based on gmail
  return {
    text: recipient.email
  }
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
    subtitle: 'Tag',
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
