import * as React from 'react'
import { Fragment } from 'react'
import Flex from 'styled-flex-component'
import { Chip, createStyles, makeStyles, Theme } from '@material-ui/core'
import classNames from 'classnames'

import { Recipient } from '../../../ContactsChipsInput/types'
import { validateRecipient } from '../../../ContactsChipsInput/helpers/validate-recipient'
import { useChipStyles } from '../../../../../styles/chip.style'
import { recipientToString } from '../../../ContactsChipsInput/helpers/recipient-to-string'

interface RecipientListProps {
  recipients: Recipient[]
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
export function RecipientList({ recipients }: RecipientListProps) {
  const classes = useStyles()
  const chipClasses = useChipStyles()
  const renderedRecipients = recipients
    .slice(0, 1)
    .map(recipient => ({
      label: recipientToString(recipient),
      recipient
    }))
    .filter(i => i)

  const remaining = recipients.length - renderedRecipients.length

  return (
    <Flex alignCenter>
      {renderedRecipients.map((item, index) => (
        <Fragment key={`${index}-${item.label}`}>
          <span
            className={classNames({
              [classes.errorUnderline]: !!validateRecipient(item.recipient)
            })}
          >
            {item.label}
          </span>
          {index < renderedRecipients.length - 1 ? ', ' : ''}
        </Fragment>
      ))}
      {remaining > 0 && (
        <>
          ,&nbsp;
          <Chip
            className={classNames({
              [chipClasses.error]: recipients
                .slice(renderedRecipients.length)
                .some(validateRecipient)
            })}
            size="small"
            label={`${remaining} other`}
          />
        </>
      )}
    </Flex>
  )
}
