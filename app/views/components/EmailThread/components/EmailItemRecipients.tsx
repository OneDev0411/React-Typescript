import * as React from 'react'
import { Typography } from '@material-ui/core'

interface Props {
  email: IEmailThreadEmail
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
