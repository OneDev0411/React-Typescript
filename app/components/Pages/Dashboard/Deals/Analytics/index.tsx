import { Typography } from '@material-ui/core'

import IframeResizer from 'iframe-resizer-react'

import { WithRouterProps } from 'react-router'

import PageLayout from 'components/GlobalPageLayout'
import { PageTabs } from 'components/PageTabs'

import { useMetaBaseDashboard } from 'hooks/use-metabase-dashboard'

import AnalyticsDropdownTab from './DropdownTab'

export default function Analytics(props: WithRouterProps) {
  const { dashboard: key } = props.params
  const { analyticsUrl, dashboard, brandType } = useMetaBaseDashboard(key)

  return (
    <PageLayout>
      <PageLayout.Header title={`Deals Analytics: ${dashboard?.label}`} />
      <PageLayout.Main>
        {brandType && (
          <PageTabs
            tabs={[
              <AnalyticsDropdownTab brandType={brandType} key="dashboard" />
            ]}
          />
        )}
        {!dashboard && <Typography>No analytics data found.</Typography>}
        {analyticsUrl && (
          <IframeResizer src={analyticsUrl} frameBorder="0" width="100%" />
        )}
      </PageLayout.Main>
    </PageLayout>
  )
}
