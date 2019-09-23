import React, { CSSProperties } from 'react'
import { Divider } from '@material-ui/core'

import useMap from 'react-use/lib/useMap'

import { EmailThreadItem } from './components/EmailThreadItem'

interface Props {
  thread: IEmailThread
  style?: CSSProperties
}

export function EmailThread({ thread, style = {} }: Props) {
  const [openedThreads, { set: setOpen }] = useMap()

  return (
    <div style={style}>
      {thread.map((email, index) => {
        const last = index === thread.length - 1

        const onToggleCollapsed = last
          ? undefined
          : collapsed => setOpen(email.id, !collapsed)

        const collapsed = last ? false : !openedThreads[email.id]

        return (
          <React.Fragment key={email.id}>
            <EmailThreadItem
              email={email}
              onToggleCollapsed={onToggleCollapsed}
              showBottomButtons={last}
              collapsed={collapsed}
            />
            {!last ? <Divider /> : null}
          </React.Fragment>
        )
      })}
    </div>
  )
}
