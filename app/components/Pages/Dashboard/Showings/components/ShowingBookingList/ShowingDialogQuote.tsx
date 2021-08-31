import { Card, Box, BoxProps, Typography, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(
  theme => ({
    root: {
      backgroundColor: theme.palette.info.ultralight,
      borderRadius: theme.spacing(0, 2, 2, 2),
      borderColor: theme.palette.action.disabledBackground
    },
    question: {
      color: theme.palette.grey[500],
      marginBottom: theme.spacing(1)
    },
    answer: { whiteSpace: 'pre-line' }
  }),
  { name: 'ShowingDialogQuote' }
)

interface ShowingDialogQuoteProps extends Pick<BoxProps, 'minHeight'> {
  question: string
  answer: string
}

function ShowingDialogQuote({
  question,
  answer,
  ...otherProps
}: ShowingDialogQuoteProps) {
  const classes = useStyles()

  return (
    <Card className={classes.root} variant="outlined">
      <Box m={2} {...otherProps}>
        <Typography variant="subtitle2" className={classes.question}>
          {question}
        </Typography>
        <Typography variant="body2" className={classes.answer}>
          {answer}
        </Typography>
      </Box>
    </Card>
  )
}

export default ShowingDialogQuote
