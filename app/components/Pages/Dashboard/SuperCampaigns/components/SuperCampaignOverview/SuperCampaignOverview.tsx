import { Box } from '@material-ui/core'

import SuperCampaignEligibleParticipants from './SuperCampaignEligibleParticipants'
import SuperCampaignEnrolledParticipants from './SuperCampaignEnrolledParticipants'
import SuperCampaignOverviewDetail from './SuperCampaignOverviewDetail'

function SuperCampaignOverview() {
  return (
    <Box display="flex">
      <Box flexBasis="320px" flexShrink="0" flexGrow="0" overflow="hidden">
        <SuperCampaignOverviewDetail />
      </Box>
      <Box flex="1" ml={2}>
        <SuperCampaignEligibleParticipants gutterBottom />
        <SuperCampaignEnrolledParticipants />
      </Box>
    </Box>
  )
}

export default SuperCampaignOverview
