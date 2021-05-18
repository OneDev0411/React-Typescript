import { Typography } from '@material-ui/core'

import { WithRouterProps } from 'react-router'

import { useSelector } from 'react-redux'

import PageLayout from 'components/GlobalPageLayout'
import { PageTabs } from 'components/PageTabs'

import MetabaseDashboard from 'components/MetabaseIFrame'

import { selectUser } from 'selectors/user'
import { getActiveBrand } from 'utils/user-teams'

import dashboards, { IDashboard } from 'constants/metabase'

import AnalyticsDropdownTab from './DropdownTab'

export default function Analytics(props: WithRouterProps) {
  const { dashboard: key } = props.params

  const user = useSelector(selectUser)
  const activeBrand = getActiveBrand(user)
  const brandType: IBrandType = activeBrand?.brand_type!

  const dashboard: IDashboard = brandType ? dashboards[brandType][key] : null

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
        {dashboard && <MetabaseDashboard dashboardId={dashboard.id} />}
      </PageLayout.Main>
    </PageLayout>
  )
}
