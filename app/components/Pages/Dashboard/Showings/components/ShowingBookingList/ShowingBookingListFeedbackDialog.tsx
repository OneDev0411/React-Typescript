import { Box, Grid } from '@material-ui/core'

import Dialog, { DialogProps } from '../Dialog'
import ShowingDialogCard from './ShowingDialogCard'

export interface ShowingBookingListFeedbackDialogProps
  extends Omit<DialogProps, 'title' | 'children'>,
    Pick<IShowingAppointment, 'contact' | 'feedback'> {}

function ShowingBookingListFeedbackDialog({
  contact,
  feedback,
  ...otherProps
}: ShowingBookingListFeedbackDialogProps) {
  return (
    <Dialog
      {...otherProps}
      title={
        <>
          {contact.display_name}
          {contact.company && (
            <Box component="span" color="grey.500">
              , {contact.company}
            </Box>
          )}
        </>
      }
    >
      <Box my={2}>
        <Grid container spacing={1}>
          {feedback?.questions.map((question, idx) => {
            const answer = feedback?.answers[idx]

            if (!answer) {
              return null
            }

            return (
              <Grid item key={idx} sm={6}>
                <ShowingDialogCard
                  question={question}
                  answer={answer}
                  minHeight={90}
                />
              </Grid>
            )
          })}
          {feedback?.comment && (
            <Grid item sm={12}>
              <ShowingDialogCard
                question="Comments or recommendations"
                answer={feedback?.comment}
                multiline
              />
            </Grid>
          )}
        </Grid>
      </Box>
    </Dialog>
  )
}

export default ShowingBookingListFeedbackDialog
