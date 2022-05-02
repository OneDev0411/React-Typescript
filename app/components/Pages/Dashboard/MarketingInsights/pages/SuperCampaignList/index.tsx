import { memo } from 'react'

import { useTitle } from 'react-use'

import SuperCampaignGridView from '@app/components/Pages/Dashboard/SuperCampaigns/pages/SuperCampaignGridView'
import { ACL } from '@app/constants/acl'
import { useAcl } from '@app/views/components/Acl/use-acl'

import Layout from '../../List/Layout'

function SuperCampaignList() {
  useTitle('Campaign List | Rechat')

  const isAdmin = useAcl(ACL.ADMIN)

  const renderContent = props => (
    <SuperCampaignGridView {...props} isAdmin={isAdmin} />
  )

  return (
    <Layout
      renderContent={props => renderContent(props)}
      hasSortFilter={isAdmin}
    />
  )
}

export default memo(SuperCampaignList)
