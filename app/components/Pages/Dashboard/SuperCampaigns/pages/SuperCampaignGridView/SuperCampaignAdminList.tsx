import { memo } from 'react'

import { LoadingComponent } from '@app/components/Pages/Dashboard/Contacts/List/Table/components/LoadingComponent'
import { EmailInsightsZeroState } from '@app/components/Pages/Dashboard/MarketingInsights/List/ZeroState'
import { goTo } from '@app/utils/go-to'
import Table from '@app/views/components/Grid/Table'
import { useGridStyles } from '@app/views/components/Grid/Table/styles'
import { TableColumn } from '@app/views/components/Grid/Table/types'
import { noop } from 'utils/helpers'

import SuperCampaignAdminListColumnStats from './SuperCampaignAdminListColumnStats'
import SuperCampaignAdminListColumnUserCount from './SuperCampaignAdminListColumnUserCount'
import SuperCampaignListColumnSubject from './SuperCampaignListColumnSubject'
import SuperCampaignListColumnTags from './SuperCampaignListColumnTags'
import { useGetAdminSuperCampaigns } from './use-get-admin-super-campaigns'

function SuperCampaignAdminList() {
  const gridClasses = useGridStyles()
  const { isLoading, superCampaigns, loadMore } = useGetAdminSuperCampaigns()

  const columns: TableColumn<ISuperCampaign>[] = [
    {
      id: 'subject',
      primary: true,
      width: '30%',
      render: ({ row }) => (
        <SuperCampaignListColumnSubject
          subject={row.subject}
          dueAt={row.due_at}
        />
      )
    },
    {
      id: 'userCount',
      width: '20%',
      render: ({ row }) => (
        <SuperCampaignAdminListColumnUserCount value={row.enrollments_count} />
      )
    },
    {
      id: 'tags',
      width: '40%',
      render: ({ row }) =>
        row.executed_at ? (
          <SuperCampaignAdminListColumnStats
            sent={row.enrollments_count}
            delivered={row.delivered}
            opened={row.opened}
            clicked={row.clicked}
          />
        ) : (
          <SuperCampaignListColumnTags label="Tags" tags={row.tags ?? []} />
        )
    },
    {
      id: 'actions',
      align: 'right',
      // TODO: Implement the admin actions component
      render: ({ row }) => null
    }
  ]

  return (
    <Table
      rows={superCampaigns}
      totalRows={superCampaigns.length}
      columns={columns}
      loading={isLoading ? 'middle' : null}
      getTrProps={() => ({
        className: gridClasses.row
      })}
      getTdProps={({ column, row }) => ({
        onClick: () => {
          if (column.id !== 'actions') {
            goTo(`/dashboard/insights/super-campaign/${row.id}/detail`)
          }
        }
      })}
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
