import { memo } from 'react'

import { makeStyles } from '@material-ui/core'

import { useGetAllSuperCampaign } from './use-get-all-super-campaign'

const useStyles = makeStyles(
  theme => ({
    body: {}
  }),
  { name: 'SuperCampaignGridView' }
)

function SuperCampaignGridView(props) {
  const classes = useStyles()

  const { isLoading, superCampaignList, setSuperCampaignList } =
    useGetAllSuperCampaign()

  console.log({ isLoading, superCampaignList, setSuperCampaignList })

  return <span>hamed</span>
}

export default memo(SuperCampaignGridView)
