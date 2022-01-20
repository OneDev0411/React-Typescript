import { Box } from '@material-ui/core'

import SuperCampaignEligibleCard from './SuperCampaignEligibleCard'
import SuperCampaignEnrollmentsCard from './SuperCampaignEnrollmentsCard'
import SuperCampaignOverviewDetail from './SuperCampaignOverviewDetail'

function SuperCampaignOverview() {
  return (
    <Box display="flex">
      <Box flexBasis="320px" flexShrink="0" flexGrow="0" overflow="hidden">
        <SuperCampaignOverviewDetail />
      </Box>
      <Box flex="1" ml={2}>
        <SuperCampaignEligibleCard gutterBottom />
        <SuperCampaignEnrollmentsCard />
      </Box>
    </Box>
  )
}

export default SuperCampaignOverview
