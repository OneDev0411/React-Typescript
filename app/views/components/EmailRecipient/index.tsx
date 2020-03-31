import * as React from 'react'

import { getPersonDisplayName } from 'utils/get-person-display-name'

import { isContact } from 'utils/type-guards/is-contact'

import { parseEmailRecipient } from '../EmailRecipientsChipsInput/helpers/parse-email-recipient'
import MiniContactProfile from '../MiniContact'

interface Props {
  /**
   * email recipient in form of 'Name <email address>' or 'email address'
   */
  recipient: string
  /**
   * an optional agent or contact which is associated to this email address.
   */
  person?: IAgent | IContact
}

/**
 * A component for rendering email recipient with a hover card.
 */
export function EmailRecipient({ recipient, person }: Props) {
  let { displayName, emailAddress } = parseEmailRecipient(recipient)

  // One improvement can be to read current user from store and render "me",
  // if email is equal to current user's email
  if (!displayName) {
    displayName = getPersonDisplayName(person) || ''
  }

  const content = (
    <span style={{ position: 'relative', zIndex: 1 }}>
      {displayName && emailAddress ? (
        <>
          {displayName}
          {emailAddress && ` <${emailAddress}>`}
        </>
      ) : (
        displayName || emailAddress
      )}
    </span>
  )

  if (person && isContact(person)) {
    return (
      <MiniContactProfile type="contact" data={person} as="span">
        {content}
      </MiniContactProfile>
    )
  }

  return (
    <MiniContactProfile
      as="span"
      data={{
        email_address: emailAddress,
        display_name: displayName !== emailAddress ? displayName : undefined
      }}
      type="insight"
    >
      {content}
    </MiniContactProfile>
  )
}
