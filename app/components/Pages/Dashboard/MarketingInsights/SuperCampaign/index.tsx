import { memo } from 'react'

import { useTitle } from 'react-use'

import SuperCampaignGridView from '@app/components/Pages/Dashboard/SuperCampaigns/pages/SuperCampaignGridView'

import Layout from '../List/Layout'

function SuperCampaignList(props) {
  useTitle('Super Campaign List | Rechat')

  const renderContent = prosp => <SuperCampaignGridView {...props} />

  return (
    <Layout
      sentCount={0}
      scheduledCount={2}
      renderContent={props => renderContent(props)}
    />
  )
}

export default memo(SuperCampaignList)
