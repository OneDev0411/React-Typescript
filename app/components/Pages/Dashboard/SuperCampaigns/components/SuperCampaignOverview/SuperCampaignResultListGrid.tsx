import { Table } from 'components/Grid/Table'
import { TableColumn } from 'components/Grid/Table/types'

import { getSuperCampaignResultPercentage } from './helpers'
import SuperCampaignColumnPerson from './SuperCampaignColumnPerson'
import SuperCampaignResultListColumn from './SuperCampaignResultListColumn'
import { useSuperCampaignListStyles } from './use-super-campaign-list-styles'

interface SuperCampaignResultListGridRow {
  user?: IUser
  brand?: IBrand
  campaign: Pick<IEmailCampaign, 'sent' | 'delivered' | 'opened' | 'clicked'>
}

interface SuperCampaignResultListGridProps {
  isHeader?: boolean
  hasRowDivider?: boolean
  rows: SuperCampaignResultListGridRow[]
}

function SuperCampaignResultListGrid({
  isHeader = false,
  hasRowDivider = false,
  rows
}: SuperCampaignResultListGridProps) {
  const classes = useSuperCampaignListStyles()

  const columns: TableColumn<SuperCampaignResultListGridRow>[] = [
    {
      id: 'person',
      width: '40%',
      sortable: false,
      render: ({ row }) =>
        row.user &&
        row.brand && (
          <SuperCampaignColumnPerson user={row.user} brand={row.brand} />
        )
    },
    {
      id: 'recipients',
      width: '15%',
      sortable: false,
      align: 'right',
      render: ({ row }) => (
        <SuperCampaignResultListColumn value={row.campaign.sent} />
      )
    },
    {
      id: 'delivered',
      width: '15%',
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
      width: '15%',
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
      width: '15%',
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

  return (
    <Table
      columns={columns}
      rows={rows}
      totalRows={rows.length}
      rowSize={5}
      getTrProps={
        hasRowDivider ? () => ({ className: classes.row }) : undefined
      }
    />
  )
}

export default SuperCampaignResultListGrid
