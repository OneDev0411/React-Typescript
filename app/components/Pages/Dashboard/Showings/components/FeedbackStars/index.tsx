import { Box, makeStyles, useTheme } from '@material-ui/core'
import { mdiStar, mdiStarHalfFull, mdiStarOutline } from '@mdi/js'
import ReactStars from 'react-rating-stars-component'

import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

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
        emptyIcon={<SvgIcon path={mdiStarOutline} className={classes.star} />}
        halfIcon={<SvgIcon path={mdiStarHalfFull} className={classes.star} />}
        filledIcon={<SvgIcon path={mdiStar} className={classes.star} />}
      />
    </Box>
  )
}

export default FeedbackStars
