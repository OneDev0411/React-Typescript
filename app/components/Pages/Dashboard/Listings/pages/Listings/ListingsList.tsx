import { useCallback, useState, useMemo, useRef, MouseEvent } from 'react'

import { Box, Chip, makeStyles, Tooltip } from '@material-ui/core'
import Pagination from '@material-ui/lab/Pagination'
import classNames from 'classnames'
import { useSelector } from 'react-redux'

import useBrandAndDealsListings from '@app/hooks/use-brand-and-deals-listings'
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

const ITEMS_PER_PAGE = 200

interface Props {
  searchTerm: string
  withPagination?: boolean
}

function ListingsList({ searchTerm, withPagination }: Props) {
  const [currentPage, setCurrentPage] = useState(1)
  const classes = useStyles()
  const gridClasses = useGridStyles()

  const listingsTableWrapperRef = useRef<Nullable<HTMLDivElement>>(null)
  const isSearching = searchTerm.trim().length > 0
  const userAgents = useSelector(selectUserAgents)

  const scrollToTop = useCallback(() => {
    if (listingsTableWrapperRef.current) {
      listingsTableWrapperRef.current?.scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    }
  }, [listingsTableWrapperRef])

  const onPageChange = useCallback(
    (_: MouseEvent<HTMLButtonElement>, pageNumber: number) => {
      setCurrentPage(pageNumber)
      scrollToTop()
    },
    [scrollToTop]
  )

  const offset = (currentPage - 1) * ITEMS_PER_PAGE
  const {
    listings: rows,
    count: totalCount,
    isLoading
  } = useBrandAndDealsListings({
    filters: {
      listing_statuses: ['Active'],
      search: searchTerm
    },
    options: { offset, limit: ITEMS_PER_PAGE },
    withListingsCount: withPagination
  })

  const isPaginationEnabled = useMemo(() => {
    return (
      withPagination &&
      !isLoading &&
      rows.length > 0 &&
      !searchTerm &&
      ITEMS_PER_PAGE <= totalCount
    )
  }, [withPagination, isLoading, rows, searchTerm, totalCount])

  const sortedRows = useListingsListSort(rows)

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
    <div ref={listingsTableWrapperRef}>
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
      {isPaginationEnabled && (
        <Box display="flex" justifyContent="center" p={4}>
          <Pagination
            data-test="pagination"
            page={currentPage}
            onChange={onPageChange}
            count={Math.ceil(totalCount / ITEMS_PER_PAGE)}
            variant="outlined"
            color="primary"
            size="large"
            shape="rounded"
          />
        </Box>
      )}
    </div>
  )
}

export default ListingsList
