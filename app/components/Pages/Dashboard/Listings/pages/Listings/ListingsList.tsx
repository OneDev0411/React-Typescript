import { makeStyles } from '@material-ui/core'

import { Table } from '@app/views/components/Grid/Table'
import { TableColumn } from '@app/views/components/Grid/Table/types'
import TableColumnProperty from '@app/views/components/TableColumnProperty'

import { getFormattedPrice } from 'models/Deal/helpers/context'

import LoadingContainer from '@app/views/components/LoadingContainer'

import { ListingRow, ListingTabType } from '../../types'
import ListingsListColumnActions from './ListingsListColumnActions'
import ListingsListColumnText from './ListingsListColumnText'
import useGetListingsListRows from './use-get-listings-list-rows'

const useStyles = makeStyles(
  {
    actions: {}
  },
  { name: 'ListingsList' }
)

interface ListingsListProps {
  type: ListingTabType
}

function ListingsList({ type }: ListingsListProps) {
  const classes = useStyles()
  const { rows, isLoading } = useGetListingsListRows(type)

  const columns: TableColumn<ListingRow>[] = [
    {
      id: 'property',
      width: '30%',
      primary: false,
      render: ({ row }) => (
        <TableColumnProperty
          image={row.cover_image_url || ''}
          address={
            row.type === 'compact_listing'
              ? row.address.street_address
              : row.property.address.street_address
          }
        />
      )
    },
    {
      id: 'status',
      width: '10%',
      primary: false,
      render: ({ row }) => (
        <ListingsListColumnText>{row.status}</ListingsListColumnText>
      )
    },
    {
      id: 'agent',
      width: '15%',
      primary: false,
      render: ({ row }) => (
        <ListingsListColumnText>
          {row.list_agent_full_name /* TODO: Ask this from Emil */}
        </ListingsListColumnText>
      )
    },
    {
      id: 'price',
      width: '10%',
      primary: false,
      render: ({ row }) => (
        <ListingsListColumnText>
          {getFormattedPrice(row.price, 'currency', 0)}
        </ListingsListColumnText>
      )
    },
    {
      id: 'actions',
      width: '35%',
      primary: false,
      align: 'right',
      render: ({ row }) => (
        <ListingsListColumnActions className={classes.actions} row={row} />
      )
    }
  ]

  return (
    <Table
      rows={rows}
      totalRows={rows.length}
      columns={columns}
      loading={isLoading ? 'middle' : null}
      LoadingStateComponent={() => (
        <LoadingContainer style={{ padding: '10% 0' }} />
      )}
      // TODO: handle empty state
      // EmptyStateComponent={() => (
      //   <ShowingEmptyState
      //     title="There are no Showings."
      //     description="Create your first showing for your off-market or MLS listings under 2 minutes."
      //   />
      // )}
    />
  )
}

export default ListingsList
