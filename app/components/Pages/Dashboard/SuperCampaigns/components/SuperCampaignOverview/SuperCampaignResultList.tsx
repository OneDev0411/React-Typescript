import SuperCampaignResultListGrid from './SuperCampaignResultListGrid'

interface SuperCampaignResultListProps {
  superCampaignResults: ISuperCampaignEnrollment<'user_and_brand_and_campaign'>[]
}

function SuperCampaignResultList({
  superCampaignResults
}: SuperCampaignResultListProps) {
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
