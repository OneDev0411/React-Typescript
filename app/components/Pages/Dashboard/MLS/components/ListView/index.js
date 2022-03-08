import React, { useCallback, useState, memo, useEffect } from 'react'

import {
  Grid,
  Checkbox,
  useTheme,
  makeStyles,
  Typography
} from '@material-ui/core'
import Pagination from '@material-ui/lab/Pagination'
import pluralize from 'pluralize'

import { changeUrl } from '@app/utils/change-url'
import Table from '@app/views/components/Grid/Table'
import { useGridStyles } from '@app/views/components/Grid/Table/styles/default'
import { ListingDetailsModal } from '@app/views/components/ListingDetailsModal'
import { useListSelection } from '@app/views/components/ListSelection/use-list-selection'
import LoadingComponent from '@app/views/components/Spinner'

import { QUERY_LIMIT, PAGE_SIZE } from '../../constants'
import { getListingsPage } from '../../helpers/pagination-utils'
import { ResultsHeader } from '../ResultsHeader'
import { ShareListings } from '../ShareListings'
import ZeroState from '../ZeroState'

import { Address } from './columns/Address'

const useStyles = makeStyles(
  theme => ({
    container: {
      marginBottom: theme.spacing(1)
    },
    paginationContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignContent: 'center',
      margin: theme.spacing(5, 0),
      paddingBottom: theme.spacing(8)
    }
  }),
  { name: 'ListView' }
)
const ListView = props => {
  const theme = useTheme()
  const classes = useStyles()

  const gridClasses = useGridStyles()
  const [currentPage, setCurrentPage] = useState(1)
  const { selections, toggleItem } = useListSelection()
  const [selectedListingId, setSelectedListingId] = useState(null)
  const [isListingDetailsModalOpen, setIsListingDetailsModalOpen] =
    useState(false)

  const closeListingDetailsModal = useCallback(() => {
    window.history.back()
    setIsListingDetailsModalOpen(false)
    setSelectedListingId(null)
  }, [])

  const openListingDetailsModal = useCallback(id => {
    changeUrl(`/dashboard/mls/${id}`)
    setIsListingDetailsModalOpen(true)
    setSelectedListingId(id)
  }, [])

  const columns = [
    {
      header: 'Address',
      id: 'address',
      width: '20%',
      render: ({ row: listing }) => (
        <Address
          address={listing.addressTitle}
          onClick={() => openListingDetailsModal(listing.id)}
        />
      )
    },
    {
      header: 'Status',
      id: 'status',
      class: 'opaque',
      render: ({ row: listing }) => `${listing.status}`
    },
    {
      header: 'Price',
      id: 'price',
      sortType: 'number',
      class: 'opaque',
      accessor: listing => listing.price,
      render: ({ row: listing }) => `$${listing.price.toLocaleString()}`
    },
    {
      header: 'Beds',
      id: 'beds',
      sortType: 'number',
      class: 'opaque',
      accessor: listing => listing.beds,
      render: ({ row: listing }) => `${pluralize('bed', listing.beds, true)}`
    },
    {
      header: 'Baths',
      id: 'baths',
      sortType: 'number',
      class: 'opaque',
      accessor: listing => listing.baths,
      render: ({ row: listing }) => `${pluralize('bath', listing.baths, true)}`
    },
    {
      header: 'sqft',
      id: 'sqft',
      sortType: 'number',
      class: 'opaque',
      accessor: listing => listing.sqft,
      render: ({ row: listing }) => `${listing.sqft.toLocaleString()} sqft`
    },
    {
      header: '$/Sqft',
      sortType: 'number',
      id: 'pricePerSquareFoot',
      class: 'opaque',
      accessor: listing => listing.pricePerSquareFoot,
      render: ({ row: listing }) =>
        `$${listing.pricePerSquareFoot.toLocaleString()}/Sqft`
    },
    {
      header: 'Built Year',
      id: 'year',
      sortType: 'number',
      class: 'opaque',
      accessor: listing => listing.builtYear,
      render: ({ row: listing }) => `Built: ${listing.builtYear}`
    },
    {
      header: 'Zip Code',
      id: 'zipcode',
      sortType: 'number',
      class: 'opaque',
      accessor: listing => listing.zipCode,
      render: ({ row: listing }) => `Zip: ${listing.zipCode}`
    }
  ]

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  useEffect(() => {
    setCurrentPage(1)
    scrollToTop()
  }, [props.sortedListings])

  const handlePageChange = (event, value) => {
    setCurrentPage(value)
    scrollToTop()
  }

  const renderTable = () => {
    if (props.isFetching) {
      return <LoadingComponent />
    }

    if (!props.sortedListings.length) {
      return (
        <ZeroState
          image={
            props.tabName === 'favorites'
              ? '/static/images/zero-state/mls-favorites.png'
              : '/static/images/zero-state/agents-network.png'
          }
          title={
            props.tabName === 'favorites'
              ? 'You don’t have any Favorites.'
              : 'You don’t have any Saved Search.'
          }
          subtitle={
            props.tabName === 'favorites'
              ? 'Try for add new Favorites.'
              : 'Try for add new Saved Search.'
          }
        />
      )
    }

    return (
      <Table
        columns={columns}
        rows={getListingsPage(props.sortedListings, currentPage, PAGE_SIZE)}
        selection={{
          render: ({ row: listing }) => (
            <Checkbox
              checked={selections.some(item => item.id === listing.id)}
              onChange={() => toggleItem(listing)}
            />
          ),
          columnProps: {
            width: theme.spacing(4)
          }
        }}
        classes={{
          row: gridClasses.row
        }}
      />
    )
  }

  const isListingsDisplayed = !props.isFetching && props.sortedListings.length

  return (
    <>
      <Grid className={classes.container}>
        <ResultsHeader
          isLoading={props.isFetching}
          mapIsShown
          currentPage={currentPage}
          total={props.info?.total}
          resultsCount={props.sortedListings.length}
          viewType="table"
          onMapToggle={() => {}}
          onToggleView={props.onToggleView}
          onChangeSort={props.onChangeSort}
          activeSort={props.activeSort}
        />
        {renderTable()}
        {isListingsDisplayed ? (
          <>
            <Grid container className={classes.paginationContainer}>
              <Pagination
                page={currentPage}
                onChange={handlePageChange}
                count={Math.ceil(props.sortedListings.length / PAGE_SIZE)}
                variant="outlined"
                color="primary"
                size="large"
                shape="rounded"
              />
            </Grid>
            {props.info && props.info.total > QUERY_LIMIT && (
              <Grid container justifyContent="center">
                <Typography variant="caption" component="p">
                  We only show {QUERY_LIMIT} results for saved searches.
                </Typography>
              </Grid>
            )}
          </>
        ) : null}
        <ListingDetailsModal
          isOpen={isListingDetailsModalOpen}
          listingId={selectedListingId}
          closeHandler={closeListingDetailsModal}
        />
        <ShareListings />
      </Grid>
    </>
  )
}

export default memo(ListView)
