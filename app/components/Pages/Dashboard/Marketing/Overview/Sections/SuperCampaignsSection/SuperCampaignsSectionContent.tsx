import SuperCampaignCards, {
  SuperCampaignCardsProps
} from './SuperCampaignCards'
import SuperCampaignsSectionLoading from './SuperCampaignsSectionLoading'

interface SuperCampaignsSectionContentProps extends SuperCampaignCardsProps {
  isLoading: boolean
}

function SuperCampaignsSectionContent({
  isLoading,
  ...otherProps
}: SuperCampaignsSectionContentProps) {
  if (isLoading) {
    return <SuperCampaignsSectionLoading />
  }

  return <SuperCampaignCards {...otherProps} />
}

export default SuperCampaignsSectionContent
