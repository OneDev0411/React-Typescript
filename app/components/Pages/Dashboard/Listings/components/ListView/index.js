import React, { useCallback, memo, useState } from 'react'
import pluralize from 'pluralize'
import { Box, Checkbox, useTheme } from '@material-ui/core'

import Table from 'components/Grid/Table'
import LoadingComponent from 'components/Spinner'
import { useGridStyles } from 'components/Grid/Table/styles'
import { ListingDetailsModal } from 'components/ListingDetailsModal'
import { useListSelection } from 'components/ListSelection/use-list-selection'

import ZeroState from '../ZeroState'
import { Address } from './columns/Address'

const BASE_URL = '/dashboard/mls'

const ListView = ({ sortedListings, listings, isFetching }) => {
  const theme = useTheme()
  const gridClasses = useGridStyles()
  const { selections, toggleItem } = useListSelection()
  const [selectedListingId, setSelectedListingId] = useState(null)
  const [isListingDetailsModalOpen, setIsListingDetailsModalOpen] = useState(
    false
  )

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

  return (
    <>
      {!sortedListings.length ? (
        <ZeroState />
      ) : (
        <Box pb={1}>
          <Table
            columns={columns}
            rows={sortedListings}
            totalRows={listings.info.total}
            loading={isFetching ? 'middle' : null}
            LoadingStateComponent={LoadingComponent}
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
          <ListingDetailsModal
            isOpen={isListingDetailsModalOpen}
            listingId={selectedListingId}
            closeHandler={closeListingDetailsModal}
          />
        </Box>
      )}
    </>
  )
}

export default memo(ListView)
