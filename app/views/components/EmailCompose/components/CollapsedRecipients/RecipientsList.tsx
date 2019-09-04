import * as React from 'react'
import { Fragment } from 'react'
import { Box, Chip, createStyles, makeStyles, Theme } from '@material-ui/core'
import classNames from 'classnames'

import { validateRecipient } from '../../../EmailRecipientsChipsInput/helpers/validate-recipient'
import { useChipStyles } from '../../../../../styles/chip.style'
import { recipientToString } from '../../../EmailRecipientsChipsInput/helpers/recipient-to-string'
import { getNumShownRecipients } from './helpers/get-num-visible-recipients'
import { getRemainingRecipientsLabel } from './helpers/get-remaining-recipients-label'

interface RecipientListProps {
  placeholder: string
  to: IDenormalizedEmailRecipientInput[]
  cc: IDenormalizedEmailRecipientInput[]
  bcc: IDenormalizedEmailRecipientInput[]
}

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      errorUnderline: {
        borderBottom: `2px dotted ${theme.palette.error.main}`
      }
    }),
  { name: 'RecipientList' }
)

export function RecipientList({
  to,
  cc,
  bcc,
  placeholder = 'Recipients'
}: RecipientListProps) {
  const classes = useStyles()
  const chipClasses = useChipStyles()
  const all = [...to, ...cc, ...bcc]
  const toAndCc = [...to, ...cc]

  const numShownRecipients = getNumShownRecipients(all)

  const empty = all.length === 0

  const remaining = all.length - numShownRecipients
  const remainingBcc = Math.min(remaining, bcc.length)

  if (empty) {
    return <Box color="text.hint">{placeholder}</Box>
  }

  return (
    <Box display="flex" alignItems="center" fontSize="body2.fontSize">
      {all.slice(0, numShownRecipients).map((recipient, index) => {
        const toString = recipientToString(recipient)

        return (
          <Fragment key={`${index}-${toString}`}>
            {index === toAndCc.length ? 'Bcc: ' : ''}
            <span
              className={classNames({
                [classes.errorUnderline]: !!validateRecipient(recipient)
              })}
            >
              {toString}
            </span>
            {index < numShownRecipients - 1 ? <>,&nbsp;</> : null}
          </Fragment>
        )
      })}
      {remaining > 0 && (
        <>
          ,&nbsp;
          <Chip
            className={classNames({
              [chipClasses.error]: all
                .slice(numShownRecipients)
                .some(validateRecipient)
            })}
            size="small"
            label={getRemainingRecipientsLabel(remaining, remainingBcc)}
          />
        </>
      )}
    </Box>
  )
}
