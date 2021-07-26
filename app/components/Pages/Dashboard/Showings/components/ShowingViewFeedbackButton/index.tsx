import { useState } from 'react'

import { Button, ButtonProps } from '@material-ui/core'

import ShowingViewFeedbackDialog, {
  ShowingViewFeedbackDialogProps
} from './ShowingViewFeedbackDialog'

export interface ShowingViewFeedbackButtonProps
  extends Omit<ButtonProps, 'onClick' | 'children'>,
    Pick<ShowingViewFeedbackDialogProps, 'contact' | 'feedback'> {
  appointmentTitle?: string
}

function ShowingViewFeedbackButton({
  contact,
  feedback,
  appointmentTitle,
  ...otherProps
}: ShowingViewFeedbackButtonProps) {
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
      <ShowingViewFeedbackDialog
        contact={contact}
        feedback={feedback}
        open={open}
        onClose={closeDialog}
        subtitle={appointmentTitle}
      />
    </>
  )
}

export default ShowingViewFeedbackButton
