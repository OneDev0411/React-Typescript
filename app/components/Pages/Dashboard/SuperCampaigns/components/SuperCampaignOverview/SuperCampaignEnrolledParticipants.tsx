import SuperCampaignCard from '../SuperCampaignCard'
import SuperCampaignCardHeader from '../SuperCampaignCardHeader'
import { useSuperCampaignDetail } from '../SuperCampaignDetailProvider'

function SuperCampaignEnrolledParticipants() {
  const { superCampaign } = useSuperCampaignDetail()

  console.log('superCampaign', superCampaign)

  return (
    <SuperCampaignCard>
      <SuperCampaignCardHeader title="Enrolled Participants By Their Contacts Tags" />
      {/* TODO: use the autocomplete field here */}
    </SuperCampaignCard>
  )
}

export default SuperCampaignEnrolledParticipants
