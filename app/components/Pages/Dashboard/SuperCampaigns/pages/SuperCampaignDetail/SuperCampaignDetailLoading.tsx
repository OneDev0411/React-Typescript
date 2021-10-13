import { Box } from '@material-ui/core'

import LoadingContainer from '@app/views/components/LoadingContainer'

function SuperCampaignDetailLoading() {
  return (
    <Box height="600px">
      <LoadingContainer
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          padding: 0
        }}
      />
    </Box>
  )
}

export default SuperCampaignDetailLoading
