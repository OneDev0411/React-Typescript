import React, { CSSProperties } from 'react'

import { EmailThreadItem } from './components/EmailThreadItem'

interface Props {
  thread: IEmailThread
  style?: CSSProperties
}

export function EmailThread({ thread, style = {} }: Props) {
  const emails = thread

  return (
    <div style={style}>
      {emails.map((email, index) => {
        return (
          <EmailThreadItem
            key={email.id}
            email={email}
            collapsed={index < emails.length - 1}
          />
        )
      })}
    </div>
  )
}
