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

import {
  getListingsPage,
  getResultsCountText
} from '@app/components/Pages/Dashboard/MLS/helpers/pagination-utils'
import Table from 'components/Grid/Table'
import { useGridStyles } from 'components/Grid/Table/styles'
import { ListingDetailsModal } from 'components/ListingDetailsModal'
import { useListSelection } from 'components/ListSelection/use-list-selection'
import LoadingComponent from 'components/Spinner'

const BASE_URL = '/dashboard/mls'
const PAGE_SIZE = 30

import { ShareListings } from '../ShareListings'
import ZeroState from '../ZeroState'

import { Address } from './columns/Address'

const useStyles = makeStyles(
  theme => ({
    container: {
      marginBottom: theme.spacing(1)
    },
    resultsCountContainer: {
      paddingLeft: theme.spacing(1),
      marginBottom: theme.spacing(2),
      color: theme.palette.text.secondary
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
const ListView = ({ sortedListings, isFetching }) => {
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
  }, [sortedListings])

  const handlePageChange = (event, value) => {
    setCurrentPage(value)
    scrollToTop()
  }

  const renderTable = () => {
    if (isFetching) {
      return <LoadingComponent />
    }

    if (!sortedListings.length) {
      return <ZeroState />
    }

    return (
      <Table
        columns={columns}
        rows={getListingsPage(sortedListings, currentPage, PAGE_SIZE)}
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

  const isListingsDisplayed = !isFetching && sortedListings.length

  return (
    <>
      <Grid className={classes.container}>
        <Grid container className={classes.resultsCountContainer}>
          {isListingsDisplayed ? (
            <Typography variant="body3">
              {getResultsCountText(
                sortedListings.length,
                currentPage,
                PAGE_SIZE
              )}
            </Typography>
          ) : null}
        </Grid>
        {renderTable()}
        {isListingsDisplayed ? (
          <Grid container className={classes.paginationContainer}>
            <Pagination
              page={currentPage}
              onChange={handlePageChange}
              count={Math.ceil(sortedListings.length / PAGE_SIZE)}
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
