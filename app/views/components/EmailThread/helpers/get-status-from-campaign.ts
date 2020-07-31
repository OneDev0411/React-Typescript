import { Status } from 'components/CampaignStatus/types'

export default function getStatusFromCampaign(
  campaign: IEmailCampaign
): Status {
  return {
    opened: campaign.opened,
    clicked: campaign.clicked
  }
}
