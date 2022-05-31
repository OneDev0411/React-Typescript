import { Chip, makeStyles, Tooltip } from '@material-ui/core'
import classNames from 'classnames'
import { useSelector } from 'react-redux'

import useBrandAndDealsListings from '@app/hooks/use-brand-and-deals-listings'
import { GetBrandListingsOptions } from '@app/models/listings/search/get-brand-listings'
import { selectUserAgents } from '@app/selectors/user'
import { isUserCoAgent } from '@app/utils/listing'
import { Table } from '@app/views/components/Grid/Table'
import { useGridStyles } from '@app/views/components/Grid/Table/styles/default'
import { TableColumn } from '@app/views/components/Grid/Table/types'
import LoadingContainer from '@app/views/components/LoadingContainer'
import { getFormattedPrice } from 'models/Deal/helpers/context'

import ListingsListColumnActions from './ListingsListColumnActions'
import ListingsListColumnProperty from './ListingsListColumnProperty'
import ListingsListColumnText from './ListingsListColumnText'
import ListingsListEmptyState from './ListingsListEmptyState'
import { ListingRow } from './types'
import useListingsListSort from './use-listings-list-sort'
import useListingsSearchRows from './use-listings-search-rows'

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

const OPTIONS: GetBrandListingsOptions = {
  status: ['Active']
}

interface Props {
  searchTerm: string
}

function ListingsList({ searchTerm }: Props) {
  const classes = useStyles()
  const gridClasses = useGridStyles()

  const isSearching = searchTerm.trim().length > 0
  const userAgents = useSelector(selectUserAgents)

  const { listings: rows, isLoading } = useBrandAndDealsListings(OPTIONS)

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
          mlsSource={row.mls_display_name}
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
      id: 'co-agent',
      width: '10%',
      primary: false,
      render: ({ row }) => (
        <>
          {isUserCoAgent(userAgents, row) && (
            <Tooltip title="You are the co-listing agent">
              <Chip label="Co-Agent" size="small" />
            </Tooltip>
          )}
        </>
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
          hasActions
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
      getTrProps={() => ({
        className: classNames(classes.row, gridClasses.row),
        'data-test': 'table-row'
      })}
      EmptyStateComponent={() => (
        <ListingsListEmptyState
          title={
            isSearching ? 'No Results ' : 'You don’t have any listings yet.'
          }
          subtitle={
            isSearching
              ? 'Make sure you have searched for the right address or try adding your other MLS Accounts using the button at the top'
              : 'Use the “Add MLS Account” button at top to connect all your MLS accounts and let us retrieve your listings.'
          }
        />
      )}
    />
  )
}

export default ListingsList
