import { memo } from 'react'

import { Box, makeStyles } from '@material-ui/core'
import { RouteComponentProps } from 'react-router'
import { useTitle } from 'react-use'

import TabContentSwitch from '@app/views/components/TabContentSwitch'
import PageLayout from 'components/GlobalPageLayout'

import { SuperCampaignDetailProvider } from '../../components/SuperCampaignDetailProvider'
import SuperCampaignOverview from '../../components/SuperCampaignOverview'
import { superCampaignDetailTabs } from '../../constants'

import SuperCampaignDetailLoading from './SuperCampaignDetailLoading'
import SuperCampaignDetailTabs, {
  SuperCampaignDetailTabsProps
} from './SuperCampaignDetailTabs'
import { useGetSuperCampaign } from './use-get-super-campaign'

const useStyles = makeStyles(
  theme => ({
    body: {
      backgroundColor: theme.palette.grey[50],
      minHeight: 'calc(100vh - 144px)' // The header height is 144px
    }
  }),
  { name: 'SuperCampaignDetail' }
)

type SuperCampaignDetailProps = RouteComponentProps<
  {
    tab?: SuperCampaignDetailTabsProps['value']
    id: UUID
  },
  {} // Used this empty type because if you pass `any` it ruins the params type
>

function SuperCampaignDetail({ params }: SuperCampaignDetailProps) {
  useTitle('Super Campaign Detail | Rechat')

  const classes = useStyles()

  const superCampaignId = params.id

  const tab = params.tab || superCampaignDetailTabs.Overview

  const { isLoading, superCampaign, setSuperCampaign } =
    useGetSuperCampaign(superCampaignId)

  return (
    <PageLayout gutter={0}>
      <Box px={4} pt={4}>
        <PageLayout.Header
          title={isLoading ? '' : superCampaign?.subject || 'Untitled Campaign'}
        />
        <Box mt={2}>
          <SuperCampaignDetailTabs
            value={tab}
            superCampaignId={superCampaignId}
          />
        </Box>
      </Box>
      <PageLayout.Main mt={0} pt={2} pb={4} className={classes.body}>
        <Box px={4}>
          {isLoading || !superCampaign ? (
            <SuperCampaignDetailLoading />
          ) : (
            <SuperCampaignDetailProvider
              superCampaign={superCampaign}
              setSuperCampaign={setSuperCampaign}
            >
              <TabContentSwitch.Container value={tab}>
                <TabContentSwitch.Item value={superCampaignDetailTabs.Overview}>
                  <SuperCampaignOverview />
                </TabContentSwitch.Item>
                <TabContentSwitch.Item value={superCampaignDetailTabs.Results}>
                  Results
                </TabContentSwitch.Item>
              </TabContentSwitch.Container>
            </SuperCampaignDetailProvider>
          )}
        </Box>
      </PageLayout.Main>
    </PageLayout>
  )
}

export default memo(SuperCampaignDetail)
