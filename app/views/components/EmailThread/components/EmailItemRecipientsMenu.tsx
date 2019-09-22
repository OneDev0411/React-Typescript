import * as React from 'react'
import { Typography } from '@material-ui/core'

interface Props {
  email: IEmailThreadEmail
}

export function EmailItemRecipientsMenu({ email }: Props) {
  return (
    <>
      <Typography noWrap>{email.to}</Typography>
    </>
  )
}
