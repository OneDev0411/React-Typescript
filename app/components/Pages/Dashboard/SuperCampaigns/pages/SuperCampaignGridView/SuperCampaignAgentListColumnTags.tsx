import SuperCampaignDisplayTags from '@app/views/components/SuperCampaignDisplayTags'

import SuperCampaignListColumnBase from './SuperCampaignListColumnBase'

interface SuperCampaignAgentListColumnTagsProps {
  tags: string[]
}

function SuperCampaignAgentListColumnTags({
  tags
}: SuperCampaignAgentListColumnTagsProps) {
  return (
    <SuperCampaignListColumnBase label="Recipients Tags">
      <SuperCampaignDisplayTags tags={tags} visibleCount={3} />
    </SuperCampaignListColumnBase>
  )
}

export default SuperCampaignAgentListColumnTags
