import { useMemo, useState } from 'react'
import { Button, Box } from '@material-ui/core'

import Dialog from '../Dialog'
import ShowingDialogCard from './ShowingDialogCard'
import { getShowingRoleLabel } from '../../helpers'

interface PersonMessage {
  role: string
  person: string
  message: Nullable<string>
}

export interface ShowingBookingListRejectMessageProps {
  approvals?: Nullable<IShowingApproval<'role'>[]>
  buyerName: string
  buyerMessage: Nullable<string>
  appointmentTitle?: string
}

function ShowingBookingListRejectMessage({
  approvals,
  buyerName,
  buyerMessage,
  appointmentTitle
}: ShowingBookingListRejectMessageProps) {
  const [open, setOpen] = useState(false)

  const personMessage = useMemo<Nullable<PersonMessage>>(() => {
    if (buyerMessage) {
      return { role: 'Buyer', person: buyerName, message: buyerMessage }
    }

    const approval = approvals?.find(
      approval => approval.approved === false && !!approval.comment
    )

    if (!approval) {
      return null
    }

    const role = approval.role

    return {
      role: getShowingRoleLabel(role.role),
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
      <Dialog
        open={open}
        onClose={closeDialog}
        title={
          <>
            {personMessage.person}
            <Box component="span" color="grey.500">
              , {personMessage.role}
            </Box>
          </>
        }
        subtitle={appointmentTitle}
      >
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
