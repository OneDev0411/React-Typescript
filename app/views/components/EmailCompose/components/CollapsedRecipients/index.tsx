import * as React from 'react'
import { createStyles, Input, makeStyles, Theme } from '@material-ui/core'

import { Recipient } from '../../../ContactsChipsInput/types'
import { InlineInputLabel } from '../../../InlineInputLabel'
import { RecipientList } from './RecipientsList'

interface Props {
  recipients: Recipient[]
  label: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '2rem',
      marginTop: `${theme.spacing(2)}px`
    }
  })
)
export function CollapsedRecipients({ recipients, label }: Props) {
  const classes = useStyles()

  return (
    <Input
      classes={{ root: classes.root }}
      fullWidth
      readOnly
      startAdornment={<InlineInputLabel>{label}</InlineInputLabel>}
      inputComponent={RecipientList}
      inputProps={{ recipients }}
    />
  )
}
