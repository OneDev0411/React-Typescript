import ReactStars from 'react-rating-stars-component'
import { Star, StarHalf, StarOutline } from '@material-ui/icons'
import { makeStyles, useTheme } from '@material-ui/core'

const useStyles = makeStyles(
  theme => ({
    star: { fontSize: theme.spacing(2) }
  }),
  { name: 'ShowingPropertyListColumnFeedback' }
)

interface ShowingPropertyListColumnFeedbackProps {
  value: number
}

function ShowingPropertyListColumnFeedback({
  value
}: ShowingPropertyListColumnFeedbackProps) {
  const classes = useStyles()
  const theme = useTheme()

  return (
    <div>
      <ReactStars
        count={5}
        value={2.5}
        edit={false}
        color={theme.palette.warning.main}
        activeColor={theme.palette.warning.main}
        isHalf
        size={0}
        emptyIcon={<StarOutline className={classes.star} />}
        halfIcon={<StarHalf className={classes.star} />}
        filledIcon={<Star className={classes.star} />}
      />
    </div>
  )
}

export default ShowingPropertyListColumnFeedback
