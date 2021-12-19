import { memo } from 'react'

import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'

import { LoadingComponent } from '@app/components/Pages/Dashboard/Contacts/List/Table/components/LoadingComponent'
import { EmailInsightsZeroState } from '@app/components/Pages/Dashboard/MarketingInsights/List/ZeroState'
import { goTo } from '@app/utils/go-to'
import Table from '@app/views/components/Grid/Table'
import { useGridStyles } from '@app/views/components/Grid/Table/styles'
import { TableColumn } from '@app/views/components/Grid/Table/types'
import { noop } from 'utils/helpers'

import SuperCampaignAdminMoreActions from '../../components/SuperCampaignAdminMoreActions'
import { isSuperCampaignReadOnly } from '../../helpers'

import SuperCampaignAdminListColumnStats from './SuperCampaignAdminListColumnStats'
import SuperCampaignAdminListColumnUserCount from './SuperCampaignAdminListColumnUserCount'
import SuperCampaignListColumnSubject from './SuperCampaignListColumnSubject'
import SuperCampaignListColumnTags from './SuperCampaignListColumnTags'
import { useGetAdminSuperCampaigns } from './use-get-admin-super-campaigns'

const useStyles = makeStyles(
  theme => ({
    row: { paddingRight: theme.spacing(1) }
  }),
  { name: 'SuperCampaignAdminList' }
)

function SuperCampaignAdminList() {
  const classes = useStyles()
  const gridClasses = useGridStyles()
  const { isLoading, superCampaigns, setSuperCampaigns, loadMore } =
    useGetAdminSuperCampaigns()

  const handleSendNow = (newSuperCampaign: ISuperCampaign) =>
    setSuperCampaigns(superCampaigns =>
      superCampaigns.map(superCampaign => {
        if (newSuperCampaign.id !== superCampaign.id) {
          return superCampaign
        }

        return newSuperCampaign
      })
    )

  const handleDelete = (superCampaignId: UUID) =>
    setSuperCampaigns(superCampaigns =>
      superCampaigns.filter(
        superCampaign => superCampaign.id !== superCampaignId
      )
    )

  const handleDuplicate = (newSuperCampaign: ISuperCampaign) =>
    setSuperCampaigns(superCampaigns => [newSuperCampaign, ...superCampaigns])

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
          onSendNow={handleSendNow}
          onDelete={() => handleDelete(row.id)}
          onDuplicate={handleDuplicate}
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
      loading={isLoading ? 'middle' : null}
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
