import { useMemo, useState } from 'react'
import { Button, Box } from '@material-ui/core'

import Dialog from '../Dialog'
import ShowingDialogCard from './ShowingDialogCard'

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
  const [open, setOpen] = useState(false)

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

  if (!personMessage || !personMessage.message) {
    return null
  }

  const openDialog = () => setOpen(true)

  const closeDialog = () => setOpen(false)

  return (
    <>
      <Button
        size="small"
        variant="text"
        color="secondary"
        onClick={openDialog}
      >
        View Message
      </Button>
      <Dialog open={open} onClose={closeDialog} title={personMessage.person}>
        <Box my={2}>
          <ShowingDialogCard
            question="Comments"
            answer={personMessage.message}
            multiline
          />
        </Box>
      </Dialog>
    </>
  )
}

export default ShowingBookingListRejectMessage
