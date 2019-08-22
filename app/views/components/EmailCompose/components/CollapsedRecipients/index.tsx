import * as React from 'react'
import { createStyles, Input, makeStyles, Theme } from '@material-ui/core'

import { ReactNode } from 'react'

import { InlineInputLabel } from '../../../InlineInputLabel'
import { RecipientList } from './RecipientsList'

interface Props {
  recipients: IDenormalizedEmailRecipientInput[]
  label: ReactNode
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '2rem'
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
