import React, { CSSProperties, useState } from 'react'
import { Divider } from '@material-ui/core'

import useMap from 'react-use/lib/useMap'

import { EmailThreadItem } from './components/EmailThreadItem'
import { ShowAllToggle } from './components/ShowAllToggle'

interface Props {
  thread: IEmailThread
  style?: CSSProperties
}

export function EmailThread({ thread, style = {} }: Props) {
  const [showAll, setShowAll] = useState(false)

  const [openedThreads, { set: setOpen }] = useMap()

  const visibleItems = thread.filter(
    (item, index) => showAll || index === 0 || index >= thread.length - 2
  )

  return (
    <div style={style}>
      {visibleItems.map((email, index) => {
        const last = index === thread.length - 1

        const onToggleCollapsed = last
          ? undefined
          : collapsed => setOpen(email.id, !collapsed)

        const collapsed = last ? false : !openedThreads[email.id]

        const numHidden = thread.length - visibleItems.length
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
            />
            {!last && !showAllToggle ? <Divider /> : null}
            {showAllToggle}
          </React.Fragment>
        )
      })}
    </div>
  )
}
