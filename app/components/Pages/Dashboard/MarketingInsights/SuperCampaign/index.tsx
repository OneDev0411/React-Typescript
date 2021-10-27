import { memo } from 'react'

import { makeStyles } from '@material-ui/core'
import { useTitle } from 'react-use'

import SuperCampaignGridView from '@app/components/Pages/Dashboard/SuperCampaigns/pages/SuperCampaignGridView'

import Layout from '../List/Layout'

const useStyles = makeStyles(
  theme => ({
    body: {}
  }),
  { name: 'SuperCampaignList' }
)

function SuperCampaignList(props) {
  useTitle('Super Campaign List | Rechat')

  const classes = useStyles()
  const renderContent = prosp => <SuperCampaignGridView {...props} />

  return (
    <Layout
      sentCount={0}
      scheduledCount={2}
      onCreateEmail={() => null}
      renderContent={props => renderContent(props)}
    />
  )
}

export default memo(SuperCampaignList)
