import { Table } from 'components/Grid/Table'
import { TableColumn } from 'components/Grid/Table/types'

import { getSuperCampaignStatsLabels } from '../../helpers'

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
  superCampaignResults: ISuperCampaignEnrollment<
    'user' | 'brand' | 'campaign'
  >[]
}

function SuperCampaignResultList({
  isLoading,
  superCampaignResults
}: SuperCampaignResultListProps) {
  const classes = useSuperCampaignListStyles()

  const { totalSent, totalDelivered, totalOpened, totalClicked } =
    useSuperCampaignResultStats(superCampaignResults)

  const columns: TableColumn<
    ISuperCampaignEnrollment<'user' | 'brand' | 'campaign'>
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
          value={getSuperCampaignStatsLabels(row.campaign).deliveredLabel}
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
          value={getSuperCampaignStatsLabels(row.campaign).openedLabel}
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
          value={getSuperCampaignStatsLabels(row.campaign).clickedLabel}
        />
      )
    }
  ]

  const { deliveredLabel, openedLabel, clickedLabel } =
    getSuperCampaignStatsLabels({
      sent: totalSent,
      delivered: totalDelivered,
      opened: totalOpened,
      clicked: totalClicked
    })

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
          value={deliveredLabel}
        />
      )
    },
    {
      header: (
        <SuperCampaignResultListColumn label="Opened" value={openedLabel} />
      )
    },
    {
      header: (
        <SuperCampaignResultListColumn label="Clicked" value={clickedLabel} />
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
        loading={isLoading ? 'static' : undefined}
        LoadingStateComponent={SuperCampaignListLoadingState}
        EmptyStateComponent={SuperCampaignListEmptyState}
      />
    </>
  )
}

export default SuperCampaignResultList
