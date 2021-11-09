import SuperCampaignCards, {
  SuperCampaignCardsProps
} from './SuperCampaignCards'
import SuperCampaignsSectionEmptyState from './SuperCampaignsSectionEmptyState'
import SuperCampaignsSectionLoading from './SuperCampaignsSectionLoading'

interface SuperCampaignsSectionContentProps extends SuperCampaignCardsProps {
  isLoading: boolean
  isEmpty: boolean
}

function SuperCampaignsSectionContent({
  isEmpty,
  isLoading,
  ...otherProps
}: SuperCampaignsSectionContentProps) {
  if (isEmpty) {
    return <SuperCampaignsSectionEmptyState />
  }

  if (isLoading) {
    return <SuperCampaignsSectionLoading />
  }

  return <SuperCampaignCards {...otherProps} />
}

export default SuperCampaignsSectionContent
