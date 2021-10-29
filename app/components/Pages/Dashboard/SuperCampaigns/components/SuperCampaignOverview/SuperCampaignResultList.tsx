import { Table } from 'components/Grid/Table'
import { TableColumn } from 'components/Grid/Table/types'

import { getSuperCampaignResultPercentage } from './helpers'
import SuperCampaignColumnPerson from './SuperCampaignColumnPerson'
import SuperCampaignListEmptyState from './SuperCampaignListEmptyState'
import SuperCampaignListLoadingState from './SuperCampaignListLoadingState'
import SuperCampaignResultListColumn from './SuperCampaignResultListColumn'
import SuperCampaignResultListHeader, {
  ListHeader
} from './SuperCampaignResultListHeader'
import SuperCampaignResultListHeaderParticipants from './SuperCampaignResultListHeaderParticipants'
import { useSuperCampaignListStyles } from './use-super-campaign-list-styles'
import { useSuperCampaignResultStats } from './use-super-campaign-result-stats'

interface SuperCampaignResultListProps {
  isLoading: boolean
  superCampaignResults: ISuperCampaignEnrollment<'user_and_brand_and_campaign'>[]
}

function SuperCampaignResultList({
  isLoading,
  superCampaignResults
}: SuperCampaignResultListProps) {
  const classes = useSuperCampaignListStyles()

  const { totalSent, totalDelivered, totalOpened, totalClicked } =
    useSuperCampaignResultStats(superCampaignResults)

  const columns: TableColumn<
    ISuperCampaignEnrollment<'user_and_brand_and_campaign'>
  >[] = [
    {
      id: 'person',
      width: '28%',
      sortable: false,
      render: ({ row }) =>
        row.user &&
        row.brand && (
          <SuperCampaignColumnPerson user={row.user} brand={row.brand} />
        )
    },
    {
      id: 'recipients',
      width: '18%',
      sortable: false,
      align: 'right',
      render: ({ row }) => (
        <SuperCampaignResultListColumn value={row.campaign.sent} />
      )
    },
    {
      id: 'delivered',
      width: '18%',
      sortable: false,
      align: 'right',
      render: ({ row }) => (
        <SuperCampaignResultListColumn
          value={`${row.campaign.delivered} ${getSuperCampaignResultPercentage(
            row.campaign.delivered,
            row.campaign.sent
          )}`}
        />
      )
    },
    {
      id: 'opened',
      width: '18%',
      sortable: false,
      align: 'right',
      render: ({ row }) => (
        <SuperCampaignResultListColumn
          value={`${row.campaign.opened} ${getSuperCampaignResultPercentage(
            row.campaign.opened,
            row.campaign.sent
          )}`}
        />
      )
    },
    {
      id: 'clicked',
      width: '18%',
      sortable: false,
      align: 'right',
      render: ({ row }) => (
        <SuperCampaignResultListColumn
          value={`${row.campaign.clicked} ${getSuperCampaignResultPercentage(
            row.campaign.clicked,
            row.campaign.sent
          )}`}
        />
      )
    }
  ]

  const headers: ListHeader[] = [
    {
      header: (
        <SuperCampaignResultListHeaderParticipants
          participantsCount={superCampaignResults.length}
        />
      )
    },
    {
      header: (
        <SuperCampaignResultListColumn label="Recipients" value={totalSent} />
      )
    },
    {
      header: (
        <SuperCampaignResultListColumn
          label="Delivered"
          value={`${totalDelivered} ${getSuperCampaignResultPercentage(
            totalDelivered,
            totalSent
          )}`}
        />
      )
    },
    {
      header: (
        <SuperCampaignResultListColumn
          label="Opened"
          value={`${totalOpened} ${getSuperCampaignResultPercentage(
            totalOpened,
            totalSent
          )}`}
        />
      )
    },
    {
      header: (
        <SuperCampaignResultListColumn
          label="Clicked"
          value={`${totalClicked} ${getSuperCampaignResultPercentage(
            totalClicked,
            totalSent
          )}`}
        />
      )
    }
  ]
    // Pick the width and alignment values from columns
    .map<ListHeader>((header, idx) => ({
      width: columns[idx]?.width,
      align: columns[idx]?.align,
      header: header.header
    }))

  return (
    <>
      <SuperCampaignResultListHeader headers={headers} />
      <Table
        columns={columns}
        rows={superCampaignResults}
        totalRows={superCampaignResults.length}
        rowSize={5}
        getTrProps={() => ({ className: classes.row })}
        loading={isLoading ? 'middle' : undefined}
        LoadingStateComponent={SuperCampaignListLoadingState}
        EmptyStateComponent={SuperCampaignListEmptyState}
      />
    </>
  )
}

export default SuperCampaignResultList
