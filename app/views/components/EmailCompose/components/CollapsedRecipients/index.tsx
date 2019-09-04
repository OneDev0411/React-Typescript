import * as React from 'react'
import { ComponentProps, ReactNode } from 'react'
import { createStyles, Input, makeStyles, Theme } from '@material-ui/core'

import { RecipientList } from './RecipientsList'

interface Props {
  to: IDenormalizedEmailRecipientInput[]
  cc?: IDenormalizedEmailRecipientInput[]
  bcc?: IDenormalizedEmailRecipientInput[]
  placeholder?: ReactNode
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '2rem'
    }
  })
)
export function CollapsedRecipients({
  to = [],
  cc = [],
  bcc = [],
  placeholder = 'Recipients'
}: Props) {
  const classes = useStyles()

  return (
    <Input
      classes={{ root: classes.root }}
      fullWidth
      readOnly
      inputComponent={RecipientList}
      inputProps={
        { to, cc, bcc, placeholder } as ComponentProps<typeof RecipientList>
      }
    />
  )
}
