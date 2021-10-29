import SuperCampaignResultListGrid from './SuperCampaignResultListGrid'
import { useGetSuperCampaignResults } from './use-get-super-campaign-results'

interface SuperCampaignResultListProps {
  superCampaignId: UUID
}

function SuperCampaignResultList({
  superCampaignId
}: SuperCampaignResultListProps) {
  const { superCampaignResults } = useGetSuperCampaignResults(superCampaignId)

  console.log('superCampaignResults', superCampaignResults)

  return (
    <>
      <SuperCampaignResultListGrid
        isHeader
        rows={[
          {
            campaign: {
              sent: 1000,
              delivered: 1000,
              opened: 1000,
              clicked: 1000
            }
          }
        ]}
      />
      <SuperCampaignResultListGrid hasRowDivider rows={superCampaignResults} />
    </>
  )
}

export default SuperCampaignResultList
