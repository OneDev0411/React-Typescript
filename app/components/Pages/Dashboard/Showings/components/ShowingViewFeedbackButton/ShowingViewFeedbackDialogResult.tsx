import { Typography, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(
  theme => ({
    root: { marginBottom: theme.spacing(2) },
    item: {
      minHeight: theme.spacing(6),
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing(0, 2),
      borderRadius: theme.shape.borderRadius,
      '&:nth-child(odd)': { backgroundColor: theme.palette.grey[50] }
    },
    answer: {
      marginLeft: theme.spacing(1),
      flexShrink: 0,
      flexGrow: 0
    }
  }),
  { name: 'ShowingViewFeedbackDialogResult' }
)

interface ShowingViewFeedbackDialogResultProps
  extends Omit<IShowingAppointmentFeedbackInput, 'comment'> {}

function ShowingViewFeedbackDialogResult({
  questions,
  answers
}: ShowingViewFeedbackDialogResultProps) {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      {questions.map((question, idx) => {
        const answer = answers[idx]

        if (!answer) {
          return null
        }

        return (
          <div className={classes.item} key={idx}>
            <Typography variant="body2">{question}</Typography>
            <Typography className={classes.answer} variant="subtitle2" noWrap>
              {answer}
            </Typography>
          </div>
        )
      })}
    </div>
  )
}

export default ShowingViewFeedbackDialogResult
