import { memo } from 'react'

import { Box } from '@material-ui/core'
import { RouteComponentProps } from 'react-router'
import { useTitle } from 'react-use'

import TabContentSwitch from '@app/views/components/TabContentSwitch'
import PageLayout from 'components/GlobalPageLayout'

import { superCampaignDetailTabs } from '../../constants'

import SuperCampaignDetailLoading from './SuperCampaignDetailLoading'
import SuperCampaignDetailTabs, {
  SuperCampaignDetailTabsProps
} from './SuperCampaignDetailTabs'
import { useGetSuperCampaign } from './use-get-super-campaign'

type SuperCampaignDetailProps = RouteComponentProps<
  {
    tab?: SuperCampaignDetailTabsProps['value']
    id: UUID
  },
  {} // Used this empty type because if you pass `any` it ruins the params type
>

function SuperCampaignDetail({ params }: SuperCampaignDetailProps) {
  useTitle('Super Campaign Detail | Rechat')

  const superCampaignId = params.id

  const tab = params.tab || superCampaignDetailTabs.Overview

  const { isLoading, superCampaign } = useGetSuperCampaign(superCampaignId)

  return (
    <PageLayout>
      <PageLayout.Header title={superCampaign?.subject || 'Page Title'} />
      {/* TODO: use a better title for default case */}
      <PageLayout.Main>
        <Box mb={4}>
          <SuperCampaignDetailTabs
            value={tab}
            superCampaignId={superCampaignId}
          />
        </Box>
        {isLoading || !superCampaign ? (
          <SuperCampaignDetailLoading />
        ) : (
          <TabContentSwitch.Container value={tab}>
            <TabContentSwitch.Item value={superCampaignDetailTabs.Overview}>
              Overview
            </TabContentSwitch.Item>
            <TabContentSwitch.Item value={superCampaignDetailTabs.Results}>
              Results
            </TabContentSwitch.Item>
          </TabContentSwitch.Container>
        )}
      </PageLayout.Main>
    </PageLayout>
  )
}

export default memo(SuperCampaignDetail)
