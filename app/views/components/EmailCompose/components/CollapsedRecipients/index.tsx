import * as React from 'react'
import { Chip, createStyles, Input, makeStyles, Theme } from '@material-ui/core'

import Flex from 'styled-flex-component'

import { Fragment } from 'react'

import { Recipient } from '../../../ContactsChipsInput/types'
import { InlineInputLabel } from '../../../InlineInputLabel'
import { RecipientToString } from '../../../ContactsChipsInput/RecipientToString'

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

interface RecipientListProps extends Pick<Props, 'recipients'> {}

function RecipientList({ recipients }: RecipientListProps) {
  const recipientStrings = recipients
    .slice(0, 1)
    .map((recipient, index) => (
      // TODO(redux): when redux is upgraded, we can replace RecipientToString
      // component with a hook (useRecipientToString) and get strings here
      // instead of react nodes. We can then change the logic here to
      // roughly compute the number of items that fit in.
      <RecipientToString key={index} recipient={recipient} />
    ))
    .filter(i => i)

  const remaining = recipients.length - recipientStrings.length

  return (
    <Flex alignCenter>
      {recipientStrings.map((recipientString, index) => (
        <Fragment key={`${index}-${recipientString}`}>
          {recipientString} {index < recipientStrings.length - 1 ? ', ' : ''}
        </Fragment>
      ))}
      {remaining > 0 && (
        <>
          ,&nbsp;
          <Chip size="small" label={`${remaining} other`} />
        </>
      )}
    </Flex>
  )
}
