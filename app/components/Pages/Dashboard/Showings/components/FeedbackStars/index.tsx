import ReactStars from 'react-rating-stars-component'
import { Star, StarHalf, StarOutline } from '@material-ui/icons'
import { Box, makeStyles, useTheme } from '@material-ui/core'

const useStyles = makeStyles(
  { star: { fontSize: 20 } },
  { name: 'FeedbackStars' }
)

interface FeedbackStarsProps {
  className?: string
  value: number
}

function FeedbackStars({ className, value }: FeedbackStarsProps) {
  const classes = useStyles()
  const theme = useTheme()

  return (
    <Box className={className} display="inline-block">
      <ReactStars
        count={5}
        value={value}
        edit={false}
        color={theme.palette.warning.dark}
        activeColor={theme.palette.warning.dark}
        isHalf
        size={0}
        emptyIcon={<StarOutline className={classes.star} />}
        halfIcon={<StarHalf className={classes.star} />}
        filledIcon={<Star className={classes.star} />}
      />
    </Box>
  )
}

export default FeedbackStars
