import React, { useMemo } from 'react'
import { Button, Tooltip, makeStyles, Typography } from '@material-ui/core'

const useStyles = makeStyles(
  theme => ({
    tooltip: { whiteSpace: 'pre-line' },
    message: { paddingLeft: theme.spacing(1) }
  }),
  { name: 'ShowingBookingListRejectMessage' }
)

interface PersonMessage {
  person: string
  message: Nullable<string>
}

export interface ShowingBookingListRejectMessageProps {
  approvals?: Nullable<IShowingApproval[]>
  buyerName: string
  buyerMessage: Nullable<string>
}

function ShowingBookingListRejectMessage({
  approvals,
  buyerName,
  buyerMessage
}: ShowingBookingListRejectMessageProps) {
  const classes = useStyles()

  const personMessage = useMemo<Nullable<PersonMessage>>(() => {
    if (buyerMessage) {
      return { person: buyerName, message: buyerMessage }
    }

    const approval = approvals?.find(
      approval => approval.approved === false && !!approval.comment
    )

    if (!approval) {
      return null
    }

    const role = approval.role as IShowingRole

    return {
      person: `${role.first_name} ${role.last_name}`.trim(),
      message: approval.comment ?? null
    }
  }, [approvals, buyerMessage, buyerName])

  if (!personMessage) {
    return null
  }

  return (
    <Tooltip
      title={
        <>
          <Typography variant="subtitle2" gutterBottom>
            {personMessage.person}:
          </Typography>
          <div className={classes.message}>{personMessage.message}</div>
        </>
      }
      classes={{ tooltip: classes.tooltip }}
    >
      <Button size="small" variant="text" color="secondary">
        View Message
      </Button>
    </Tooltip>
  )
}

export default ShowingBookingListRejectMessage
