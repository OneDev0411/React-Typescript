import { connect } from 'react-redux'

import * as React from 'react'

import { IAppState } from 'reducers/index'
import {
  IAttributeDefsState,
  selectDefinitionByName
} from 'reducers/contacts/attributeDefs'

import { getContactAttribute } from 'models/contacts/helpers/get-contact-attribute'

import { Recipient } from './types'
import { isContactList, isContactTag } from './helpers'

interface Props {
  attributeDefs: IAttributeDefsState
  recipient: Recipient
}

export const RecipientToString = connect(
  ({ contacts: { attributeDefs } }: IAppState) => ({ attributeDefs })
)(function RecipientToString({ recipient, attributeDefs }: Props) {
  if (isContactList(recipient)) {
    return <>{recipient.name} (List)</>
  }

  if (isContactTag(recipient)) {
    return <>{recipient.text} (Tag)</>
  }

  if (recipient.email) {
    if (!recipient.contact || !recipient.contact.display_name) {
      return <>{recipient.email}</>
    }

    // We have a contact here which has a display name.
    // if it has multiple emails, show email in parentheses. Otherwise, only name
    let emails: string[] = []

    try {
      emails = getContactAttribute(
        recipient.contact,
        selectDefinitionByName(attributeDefs, 'email')
      ).map(attr => attr.text)
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
      <>
        {recipient.contact.display_name}
        {showEmail
          ? ` (${recipient.email
              .split('@')
              .slice(onlyShowDomain ? 1 : 0)
              .join('@')})`
          : null}
      </>
    )
  }

  return <></>
})

function getEmailDomain(email) {
  return email.split('@')[1]
}
