import { makeStyles } from '@material-ui/core'

import { Table } from '@app/views/components/Grid/Table'
import { TableColumn } from '@app/views/components/Grid/Table/types'
import TableColumnProperty from '@app/views/components/TableColumnProperty'

import { getFormattedPrice } from 'models/Deal/helpers/context'

import LoadingContainer from '@app/views/components/LoadingContainer'

import useActiveBrandListings from '@app/hooks/use-active-brand-listings'

import { ListingRow } from '../../types'
import ListingsListColumnActions from './ListingsListColumnActions'
import ListingsListColumnText from './ListingsListColumnText'

const useStyles = makeStyles(
  theme => ({
    row: { '&:hover $actions': { opacity: 1 } },
    actions: {
      opacity: 0,
      transition: theme.transitions.create('opacity')
    }
  }),
  { name: 'ListingsList' }
)

function ListingsList() {
  const classes = useStyles()
  const { listings: rows, isLoading } = useActiveBrandListings()

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
          {row.list_agent_full_name}
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
      getTrProps={() => ({
        className: classes.row
      })}

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
