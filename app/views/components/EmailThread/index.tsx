import React, { CSSProperties } from 'react'

import { EmailThreadItem } from './components/EmailThreadItem'

interface Props {
  thread: IEmailThread
  style?: CSSProperties
}

export function EmailThread({ thread, style = {} }: Props) {
  return (
    <div style={style}>
      {thread.map((email, index) => {
        return (
          <EmailThreadItem
            key={email.id}
            email={email}
            collapsed={index < thread.length - 1}
          />
        )
      })}
    </div>
  )
}
