import * as React from 'react'
import Flex from 'styled-flex-component'
import { Fragment } from 'react'
import { Chip, createStyles, makeStyles, Theme } from '@material-ui/core'
import classNames from 'classnames'

import { RecipientToString } from '../../../ContactsChipsInput/RecipientToString'
import { Recipient } from '../../../ContactsChipsInput/types'
import { validateRecipient } from '../../../ContactsChipsInput/helpers/validate-recipient'
import { useChipStyles } from '../../../../../styles/chip.style'

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
    .map((recipient, index) =>
      // TODO(redux): when redux is upgraded, we can replace RecipientToString
      // component with a hook (useRecipientToString) and get strings here
      // instead of react nodes. We can then change the logic here to
      // roughly compute the number of items that fit in.
      ({
        toString: <RecipientToString key={index} recipient={recipient} />,
        recipient
      })
    )
    .filter(i => i)

  const remaining = recipients.length - renderedRecipients.length

  return (
    <Flex alignCenter>
      {renderedRecipients.map((item, index) => (
        <Fragment key={`${index}-${item.toString}`}>
          <span
            className={classNames({
              [classes.errorUnderline]: !!validateRecipient(item.recipient)
            })}
          >
            {item.toString}
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
