import { Box, Card, Grid, Typography } from '@material-ui/core'

import Dialog, { DialogProps } from '../Dialog'

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
                <Card variant="outlined">
                  <Box mt={1} mx={2} mb={1}>
                    <Typography variant="body2" gutterBottom>
                      {question}
                    </Typography>
                    <Typography variant="h6">{answer}</Typography>
                  </Box>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      </Box>
    </Dialog>
  )
}

export default ShowingBookingListFeedbackDialog
