import { Box, Typography } from '@material-ui/core'

interface ShowingDetailTabVisitorsColumnTotalVisitProps {
  count: number
}

function ShowingDetailTabVisitorsColumnTotalVisit({
  count
}: ShowingDetailTabVisitorsColumnTotalVisitProps) {
  return (
    <Box color="grey.500">
      <Typography variant="body2" component="span">
        Total visit:
      </Typography>
      <Box color="common.black" component="span">
        {' '}
        {count}
      </Box>
    </Box>
  )
}

export default ShowingDetailTabVisitorsColumnTotalVisit
