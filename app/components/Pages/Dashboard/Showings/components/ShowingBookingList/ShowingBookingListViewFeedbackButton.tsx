import { useState } from 'react'
import { Button, ButtonProps } from '@material-ui/core'

import ShowingBookingListFeedbackDialog, {
  ShowingBookingListFeedbackDialogProps
} from './ShowingBookingListFeedbackDialog'

export interface ShowingBookingListViewFeedbackButtonProps
  extends Omit<ButtonProps, 'onClick' | 'children'>,
    Pick<ShowingBookingListFeedbackDialogProps, 'contact' | 'feedback'> {
  appointmentTitle?: string
}

function ShowingBookingListViewFeedbackButton({
  contact,
  feedback,
  appointmentTitle,
  ...otherProps
}: ShowingBookingListViewFeedbackButtonProps) {
  const [open, setOpen] = useState(false)

  const openDialog = () => setOpen(true)

  const closeDialog = () => setOpen(false)

  return (
    <>
      <Button
        {...otherProps}
        variant="text"
        color="secondary"
        onClick={openDialog}
      >
        View Feedback
      </Button>
      <ShowingBookingListFeedbackDialog
        contact={contact}
        feedback={feedback}
        open={open}
        onClose={closeDialog}
        subtitle={appointmentTitle}
      />
    </>
  )
}

export default ShowingBookingListViewFeedbackButton
