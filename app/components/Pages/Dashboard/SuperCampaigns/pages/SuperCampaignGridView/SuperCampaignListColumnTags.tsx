import SuperCampaignDisplayTags from '@app/views/components/SuperCampaignDisplayTags'

import SuperCampaignListColumnBase from './SuperCampaignListColumnBase'

interface SuperCampaignListColumnTagsProps {
  label: string
  tags: string[]
}

function SuperCampaignListColumnTags({
  label,
  tags
}: SuperCampaignListColumnTagsProps) {
  return (
    <SuperCampaignListColumnBase label={label}>
      <SuperCampaignDisplayTags tags={tags} visibleCount={3} />
    </SuperCampaignListColumnBase>
  )
}

export default SuperCampaignListColumnTags
