import { useState } from 'react'
import { Button, ButtonProps } from '@material-ui/core'

import ShowingBookingListFeedbackDialog, {
  ShowingBookingListFeedbackDialogProps
} from './ShowingBookingListFeedbackDialog'

export interface ShowingBookingListViewFeedbackButtonProps
  extends Omit<ButtonProps, 'onClick' | 'children'>,
    Pick<ShowingBookingListFeedbackDialogProps, 'contact' | 'feedback'> {
  feedbackSubtitle?: string
}

function ShowingBookingListViewFeedbackButton({
  contact,
  feedback,
  feedbackSubtitle,
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
        subtitle={feedbackSubtitle}
      />
    </>
  )
}

export default ShowingBookingListViewFeedbackButton
