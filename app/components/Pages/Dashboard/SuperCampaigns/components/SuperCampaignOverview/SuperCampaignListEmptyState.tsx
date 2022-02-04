import { Box, Typography } from '@material-ui/core'

function SuperCampaignListEmptyState() {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="120px"
    >
      <Typography variant="body2">There are no enrollments.</Typography>
    </Box>
  )
}

export default SuperCampaignListEmptyState
