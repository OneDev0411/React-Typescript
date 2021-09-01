import React, { useCallback, useState, memo, useEffect } from 'react'

import { Grid, Checkbox, useTheme, makeStyles } from '@material-ui/core'
import Pagination from '@material-ui/lab/Pagination'
import pluralize from 'pluralize'

import Table from 'components/Grid/Table'
import { useGridStyles } from 'components/Grid/Table/styles'
import { ListingDetailsModal } from 'components/ListingDetailsModal'
import { useListSelection } from 'components/ListSelection/use-list-selection'
import LoadingComponent from 'components/Spinner'

import { getListingsPage } from '../../helpers/pagination-utils'
import { ResultsHeader } from '../ResultsHeader'
import { ShareListings } from '../ShareListings'
import ZeroState from '../ZeroState'

import { Address } from './columns/Address'

const BASE_URL = '/dashboard/properties'
const PAGE_SIZE = 30

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
    window.history.replaceState({}, '', BASE_URL)
    setIsListingDetailsModalOpen(false)
    setSelectedListingId(null)
  }, [])

  const openListingDetailsModal = useCallback(id => {
    window.history.replaceState({}, '', `${BASE_URL}/${id}`)
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
      return <ZeroState />
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
          resultsCount={props.sortedListings.length}
          viewType="table"
          onMapToggle={() => {}}
          onToggleView={props.onToggleView}
          onChangeSort={props.onChangeSort}
          activeSort={props.activeSort}
        />
        {renderTable()}
        {isListingsDisplayed ? (
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
