import React, { CSSProperties, useState } from 'react'
import { Divider } from '@material-ui/core'

import useMap from 'react-use/lib/useMap'

import { EmailThreadItem } from './components/EmailThreadItem'
import { ShowAllToggle } from './components/ShowAllToggle'
import {
  isGoogleMessage,
  isMicrosoftMessage
} from '../EmailCompose/helpers/type-guards'

interface Props {
  thread: IEmailThread<'messages'>
  style?: CSSProperties

  /**
   * Callback to be called when an email in the thread is replied/forwarded
   */
  onEmailSent?: (email: IEmailThreadEmail) => void
}

export function EmailThreadEmails({ thread, style = {}, onEmailSent }: Props) {
  const [showAll, setShowAll] = useState(false)

  const [openedThreads, { set: setOpen }] = useMap()

  const visibleItems = showAll
    ? thread.messages
    : thread.messages.filter(
        (item, index) => index === 0 || index >= thread.messages.length - 2
      )

  let fallbackCredential = ''

  thread.messages.some(email => {
    if (isGoogleMessage(email)) {
      fallbackCredential = email.google_credential

      return true
    }

    if (isMicrosoftMessage(email)) {
      fallbackCredential = email.microsoft_credential

      return true
    }
  })

  return (
    <div style={style}>
      {visibleItems.map((email, index) => {
        const last = index === visibleItems.length - 1

        const onToggleCollapsed = last
          ? undefined
          : collapsed => setOpen(email.id, !collapsed)

        const collapsed = last ? false : !openedThreads[email.id]

        const numHidden = thread.messages.length - visibleItems.length
        const showAllToggle =
          index === 0 && !showAll && numHidden > 0 ? (
            <ShowAllToggle
              onClick={() => setShowAll(true)}
              numHidden={numHidden}
            />
          ) : null

        return (
          <React.Fragment key={email.id}>
            <EmailThreadItem
              email={email}
              onToggleCollapsed={onToggleCollapsed}
              showBottomButtons={last}
              collapsed={collapsed}
              fallbackCredential={fallbackCredential || undefined}
              onEmailSent={onEmailSent}
            />
            {!last && !showAllToggle ? <Divider /> : null}
            {showAllToggle}
          </React.Fragment>
        )
      })}
    </div>
  )
}
