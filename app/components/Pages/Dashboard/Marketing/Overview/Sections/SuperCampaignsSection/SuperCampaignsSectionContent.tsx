import SuperCampaignCards, {
  SuperCampaignCardsProps
} from './SuperCampaignCards'

function SuperCampaignsSectionContent({
  ...otherProps
}: SuperCampaignCardsProps) {
  return <SuperCampaignCards {...otherProps} />
}

export default SuperCampaignsSectionContent
