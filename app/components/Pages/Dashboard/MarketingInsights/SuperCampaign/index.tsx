import { memo } from 'react'

import { useTitle } from 'react-use'

import SuperCampaignGridView from '@app/components/Pages/Dashboard/SuperCampaigns/pages/SuperCampaignGridView'

import Layout from '../List/Layout'

function SuperCampaignList(props) {
  useTitle('Campaign List | Rechat')

  const renderContent = props => <SuperCampaignGridView {...props} />

  return <Layout renderContent={props => renderContent(props)} />
}

export default memo(SuperCampaignList)
