import React, { CSSProperties, useState } from 'react'
import { Divider } from '@material-ui/core'

import useMap from 'react-use/lib/useMap'

import { EmailThreadItem } from './components/EmailThreadItem'
import { ShowAllToggle } from './components/ShowAllToggle'
import { EmailThreadEmail } from './types'

interface Props {
  emails: EmailThreadEmail[]
  style?: CSSProperties

  /**
   * Callback to be called when an email in the thread is replied/forwarded
   */
  onEmailSent?: (email: IEmailCampaign) => void
  hideBottomButtons?: boolean
}

export function EmailThreadEmails({
  emails,
  style = {},
  onEmailSent,
  hideBottomButtons
}: Props) {
  const [showAll, setShowAll] = useState(false)

  const [openedThreads, { set: setOpen }] = useMap()

  const visibleItems = showAll
    ? emails
    : emails.filter((item, index) => index === 0 || index >= emails.length - 2)

  return (
    <div style={style}>
      {visibleItems.map((email, index) => {
        const last = index === visibleItems.length - 1

        const onToggleCollapsed = last
          ? undefined
          : collapsed => setOpen(email.id, !collapsed)

        const collapsed = last ? false : !openedThreads[email.id]

        const numHidden = emails.length - visibleItems.length
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
              showBottomButtons={!hideBottomButtons && last}
              collapsed={collapsed}
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
