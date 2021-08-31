import { Box } from '@material-ui/core'

import Dialog, { DialogProps } from '../Dialog'
import ShowingDialogQuote from '../ShowingBookingList/ShowingDialogQuote'

import ShowingViewFeedbackDialogResult from './ShowingViewFeedbackDialogResult'

export interface ShowingViewFeedbackDialogProps
  extends Omit<DialogProps, 'title' | 'children' | 'hasDialogContent'>,
    Pick<IShowingAppointment, 'contact' | 'feedback'> {}

function ShowingViewFeedbackDialog({
  contact,
  feedback,
  ...otherProps
}: ShowingViewFeedbackDialogProps) {
  return (
    <Dialog
      {...otherProps}
      title={
        <>
          {contact.display_name}
          {contact.company && (
            <>
              {' '}
              <Box component="span" color="grey.500">
                from
              </Box>{' '}
              {contact.company}
            </>
          )}
        </>
      }
      hasDialogContent={false}
    >
      <Box m={2}>
        {feedback && (
          <ShowingViewFeedbackDialogResult
            questions={feedback.questions}
            answers={feedback.answers}
          />
        )}
        {feedback?.comment && (
          <ShowingDialogQuote
            question={`${contact.first_name}\'s feedback`}
            answer={feedback.comment}
          />
        )}
      </Box>
    </Dialog>
  )
}

export default ShowingViewFeedbackDialog
