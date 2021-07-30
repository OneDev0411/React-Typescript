import { useMemo, useState } from 'react'

import { Box, IconButton, Badge } from '@material-ui/core'
import { mdiCommentTextMultiple, mdiCommentTextMultipleOutline } from '@mdi/js'

import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { getShowingRoleLabel } from '../../helpers'
import Dialog from '../Dialog'

import ShowingDialogCard from './ShowingDialogCard'
import useAppointmentMessageReadStatus from './use-appointment-message-read-status'

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
  notifications: Nullable<INotification[]>
}

function ShowingBookingListRejectMessage({
  approvals,
  buyerName,
  buyerMessage,
  appointmentTitle,
  notifications
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

  const hasMessage = !!personMessage?.message
  const { isMessageRead, notificationId } =
    useAppointmentMessageReadStatus(notifications)

  // TODO: Use the notificationId to ack the notification when message was opened
  console.log('################ notificationId', notificationId)

  const openDialog = () => setOpen(true)

  const closeDialog = () => setOpen(false)

  if (!personMessage) {
    return null
  }

  return (
    <>
      <IconButton size="medium" color="inherit" onClick={openDialog}>
        <Badge
          variant="dot"
          badgeContent="1"
          color="error"
          invisible={isMessageRead}
        >
          <SvgIcon
            path={
              hasMessage
                ? mdiCommentTextMultiple
                : mdiCommentTextMultipleOutline
            }
          />
        </Badge>
      </IconButton>
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
            answer={personMessage.message ?? ''}
            multiline
          />
        </Box>
      </Dialog>
    </>
  )
}

export default ShowingBookingListRejectMessage
