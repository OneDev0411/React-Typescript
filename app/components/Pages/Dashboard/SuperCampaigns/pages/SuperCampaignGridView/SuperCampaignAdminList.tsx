import { memo } from 'react'

import { Theme, makeStyles } from '@material-ui/core'
import { Link } from 'react-router'

import { LoadingComponent } from '@app/components/Pages/Dashboard/Contacts/List/Table/components/LoadingComponent'
import { EmailInsightsZeroState } from '@app/components/Pages/Dashboard/MarketingInsights/List/ZeroState'
import Table from '@app/views/components/Grid/Table'
import { noop } from 'utils/helpers'

import { useGetAdminSuperCampaigns } from './use-get-admin-super-campaigns'

const useStyles = makeStyles(
  (theme: Theme) => ({
    title: {
      ...theme.typography.body1,
      color: theme.palette.common.black
    }
  }),
  {
    name: 'SuperCampaignAdminList'
  }
)

function SuperCampaignAdminList() {
  const classes = useStyles()
  const { isLoading, superCampaigns, loadMore } = useGetAdminSuperCampaigns()

  const columns = [
    {
      header: 'Subject',
      id: 'subject',
      primary: true,
      width: '32%',
      verticalAlign: 'center',
      render: ({ row }) => (
        <Link
          to={`/dashboard/insights/super-campaign/${row.id}/detail`}
          className={classes.title}
        >
          {row.subject || '(Untitled Campaign)'}
        </Link>
      )
    }
  ]

  return (
    <Table
      rows={superCampaigns ?? []}
      totalRows={superCampaigns?.length ?? 0}
      columns={columns}
      loading={isLoading ? 'middle' : null}
      LoadingStateComponent={LoadingComponent}
      infiniteScrolling={{
        onReachStart: noop,
        onReachEnd: loadMore
      }}
      EmptyStateComponent={() => (
        <EmailInsightsZeroState
          title="No campaign to show, yet."
          subTitle="Try creating your first campaign and help your agents"
        />
      )}
    />
  )
}

export default memo(SuperCampaignAdminList)
