import { Box, Divider } from '@material-ui/core'

import SuperCampaignCard, { SuperCampaignCardProps } from '../SuperCampaignCard'

import SuperCampaignEligibleCardBrands from './SuperCampaignEligibleCardBrands'
import SuperCampaignEligibleCardSection from './SuperCampaignEligibleCardSection'
import SuperCampaignEligibleCardTags from './SuperCampaignEligibleCardTags'

type SuperCampaignEligibleCardProps = SuperCampaignCardProps

function SuperCampaignEligibleCard(props: SuperCampaignEligibleCardProps) {
  return (
    <SuperCampaignCard {...props}>
      <SuperCampaignEligibleCardSection subject="Send email on behalf of users in the following offices and teams">
        <SuperCampaignEligibleCardBrands />
      </SuperCampaignEligibleCardSection>
      <Box my={0.5}>
        <Divider />
      </Box>
      <SuperCampaignEligibleCardSection subject="To any of their contacts that are in the following tags">
        <SuperCampaignEligibleCardTags />
      </SuperCampaignEligibleCardSection>
    </SuperCampaignCard>
  )
}

export default SuperCampaignEligibleCard
