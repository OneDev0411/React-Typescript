import { memo } from 'react'

import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'

import { LoadingComponent } from '@app/components/Pages/Dashboard/Contacts/List/Table/components/LoadingComponent'
import { EmailInsightsZeroState } from '@app/components/Pages/Dashboard/MarketingInsights/List/ZeroState'
import { useGetAllSuperCampaigns } from '@app/models/super-campaign'
import { goTo } from '@app/utils/go-to'
import Table from '@app/views/components/Grid/Table'
import { useGridStyles } from '@app/views/components/Grid/Table/styles/default'
import { TableColumn } from '@app/views/components/Grid/Table/types'
import { noop } from 'utils/helpers'

import SuperCampaignAdminMoreActions from '../../components/SuperCampaignAdminMoreActions'
import { isSuperCampaignReadOnly } from '../../helpers'

import SuperCampaignAdminListColumnStats from './SuperCampaignAdminListColumnStats'
import SuperCampaignAdminListColumnUserCount from './SuperCampaignAdminListColumnUserCount'
import SuperCampaignListColumnSubject from './SuperCampaignListColumnSubject'
import SuperCampaignListColumnTags from './SuperCampaignListColumnTags'

const useStyles = makeStyles(
  theme => ({
    row: { paddingRight: theme.spacing(1) }
  }),
  { name: 'SuperCampaignAdminList' }
)

interface SuperCampaignAdminListProps {
  sortDir: 'ASC' | 'DESC'
}

const SORT_ASC = ['+due_at', '+updated_at', '+created_at']
const SORT_DESC = ['-due_at', '-updated_at', '-created_at']

function SuperCampaignAdminList({ sortDir }: SuperCampaignAdminListProps) {
  const classes = useStyles()
  const gridClasses = useGridStyles()

  const { data, isFetching, fetchNextPage } = useGetAllSuperCampaigns(
    sortDir === 'ASC' ? SORT_ASC : SORT_DESC
  )

  const superCampaigns =
    data?.pages.reduce((items, page) => [...items, ...page], []) || []

  const columns: TableColumn<ISuperCampaign<'template_instance'>>[] = [
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
        isSuperCampaignReadOnly(row) ? (
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
      render: ({ row }) => (
        <SuperCampaignAdminMoreActions
          superCampaign={row}
          // TODO: The sent item needs to display the real campaign stats when it is executed. This means
          // we need to have a socket or pulling mechanism to get the stats and update the list.
          // I hid the send now option temporarily because of my limited time but I'll enable it soon.
          displaySendNow={false}
        />
      )
    }
  ]

  return (
    <Table
      rows={superCampaigns}
      totalRows={superCampaigns.length}
      columns={columns}
      loading={isFetching ? 'middle' : null}
      getTrProps={() => ({
        className: classNames(gridClasses.row, classes.row)
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
        onReachEnd: fetchNextPage
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
