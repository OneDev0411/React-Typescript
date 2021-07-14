import { makeStyles } from '@material-ui/core'

import { Table } from '@app/views/components/Grid/Table'
import { TableColumn } from '@app/views/components/Grid/Table/types'

import { getFormattedPrice } from 'models/Deal/helpers/context'

import LoadingContainer from '@app/views/components/LoadingContainer'

import useBrandAndDealsListings from '@app/hooks/use-brand-and-deals-listings'

import { ListingRow } from './types'
import ListingsListColumnActions, {
  ListingsListColumnActionsProps
} from './ListingsListColumnActions'
import ListingsListColumnText from './ListingsListColumnText'
import ListingsListEmptyState from './ListingsListEmptyState'
import ListingsListColumnProperty from './ListingsListColumnProperty'
import useListingsSearchRows from './use-listings-search-rows'
import useListingsListSort from './use-listings-list-sort'

const useStyles = makeStyles(
  theme => ({
    row: {
      paddingRight: theme.spacing(1),
      '&:hover $actions': { opacity: 1 }
    },
    actions: {
      opacity: 0,
      transition: theme.transitions.create('opacity')
    }
  }),
  { name: 'ListingsList' }
)

interface ListingsListProps
  extends Pick<ListingsListColumnActionsProps, 'hasActions'> {
  brandId: UUID
  searchTerm: string
}

function ListingsList({ brandId, hasActions, searchTerm }: ListingsListProps) {
  const classes = useStyles()
  const { listings: rows, isLoading } = useBrandAndDealsListings(brandId)

  const resultRows = useListingsSearchRows(rows, searchTerm)
  const sortedRows = useListingsListSort(resultRows)

  const columns: TableColumn<ListingRow>[] = [
    {
      id: 'property',
      width: '30%',
      primary: true,
      render: ({ row }) => (
        <ListingsListColumnProperty
          image={row.cover_image_url || ''}
          address={
            row.type === 'compact_listing'
              ? row.address.street_address
              : row.property.address.street_address
          }
          listingId={row.id}
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
        <ListingsListColumnActions
          className={classes.actions}
          row={row}
          hasActions={hasActions}
        />
      )
    }
  ]

  return (
    <Table
      rows={sortedRows}
      totalRows={sortedRows.length}
      columns={columns}
      loading={isLoading ? 'middle' : null}
      LoadingStateComponent={() => (
        <LoadingContainer style={{ padding: '10% 0' }} />
      )}
      getTrProps={() => ({ className: classes.row })}
      EmptyStateComponent={() => (
        <ListingsListEmptyState
          message={searchTerm ? 'No results' : 'There are no listings.'}
        />
      )}
    />
  )
}

export default ListingsList
