import { Card, Box, Typography } from '@material-ui/core'

interface ShowingBookingListFeedbackCardProps {
  question: string
  answer: string
}

function ShowingBookingListFeedbackCard({
  question,
  answer
}: ShowingBookingListFeedbackCardProps) {
  return (
    <Card variant="outlined">
      <Box mt={1} mx={2} mb={1}>
        <Typography variant="body2" gutterBottom>
          {question}
        </Typography>
        <Typography variant="h6">{answer}</Typography>
      </Box>
    </Card>
  )
}

export default ShowingBookingListFeedbackCard
