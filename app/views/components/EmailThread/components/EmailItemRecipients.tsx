import * as React from 'react'
import { Typography } from '@material-ui/core'

import { EmailThreadEmail } from '../types'

interface Props {
  email: EmailThreadEmail
}

export function EmailItemRecipients({ email }: Props) {
  const { to = [], cc = [], bcc = [] } = email

  return (
    <>
      <Typography noWrap>
        to {[...to, ...cc].map(getName).join(', ')}
        {bcc.length > 0 ? `, bcc: ${bcc.map(getName).join(',')}` : null}
      </Typography>
    </>
  )
}

function getName(emailAddress: string) {
  return emailAddress.split(' ')[0]
}
