import { Box } from '@material-ui/core'

import LoadingContainer from '@app/views/components/LoadingContainer'

function SuperCampaignListLoadingState() {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="120px"
    >
      <LoadingContainer noPaddings size="4rem" />
    </Box>
  )
}

export default SuperCampaignListLoadingState
