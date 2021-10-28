import { memo } from 'react'

import { makeStyles } from '@material-ui/core'

import { LoadingComponent } from '@app/components/Pages/Dashboard/Contacts/List/Table/components/LoadingComponent'
import { EmailInsightsZeroState } from '@app/components/Pages/Dashboard/MarketingInsights/List/ZeroState'

import { useGetAllSuperCampaign } from './use-get-all-super-campaign'

const useStyles = makeStyles(
  theme => ({
    body: {}
  }),
  { name: 'SuperCampaignGridView' }
)

function SuperCampaignGridView(props) {
  const classes = useStyles()

  const { isLoading, superCampaignList } = useGetAllSuperCampaign()

  console.log({ isLoading, superCampaignList })

  if (isLoading) {
    return <LoadingComponent />
  }

  if (superCampaignList?.length === 0) {
    return (
      <EmailInsightsZeroState
        title="No super campaign to show, yet."
        subTitle="Try creating your first super campaign and help your agents"
      />
    )
  }

  return <span>hamed</span>
}

export default memo(SuperCampaignGridView)
