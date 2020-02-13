import React from 'react'

import pluralize from 'pluralize'

import { Box } from '@material-ui/core'
import { useTheme } from '@material-ui/styles'

import Table from '../../../../../../views/components/Grid/Table'
import LoadingComponent from '../../../../../../views/components/Spinner'

import { Address } from './columns/Address'

const ListView = ({ sortedListings, listings, isFetching }) => {
  const theme = useTheme()

  const columns = [
    {
      header: 'Address',
      id: 'address',
      width: '20%',
      render: ({ row: listing }) => <Address listing={listing} />
    },
    {
      header: 'Status',
      id: 'status',
      render: ({ row: listing }) => `${listing.status}`
    },
    {
      header: 'Price',
      id: 'price',
      sortType: 'number',
      accessor: listing => listing.price,
      render: ({ row: listing }) => `$${listing.price.toLocaleString()}`
    },
    {
      header: 'Beds',
      id: 'beds',
      sortType: 'number',
      accessor: listing => listing.beds,
      render: ({ row: listing }) => `${pluralize('bed', listing.beds, true)}`
    },
    {
      header: 'Baths',
      id: 'baths',
      sortType: 'number',
      accessor: listing => listing.baths,
      render: ({ row: listing }) => `${pluralize('bath', listing.baths, true)}`
    },
    {
      header: 'sqft',
      id: 'sqft',
      sortType: 'number',
      accessor: listing => listing.sqft,
      render: ({ row: listing }) => `${listing.sqft.toLocaleString()} sqft`
    },
    // {
    //   header: '$/Sqft',
    //   sortType: 'number',
    //   id: 'pricePerSquareFoot',
    //   accessor: listing => listing.pricePerSquareFoot,
    //   render: ({ row: listing }) =>
    //     `$${listing.pricePerSquareFoot.toLocaleString()}`
    // },
    {
      header: 'Built Year',
      id: 'year',
      sortType: 'number',
      accessor: listing => listing.builtYear,
      render: ({ row: listing }) => `Built: ${listing.builtYear}`
    },
    {
      header: 'Zip Code',
      id: 'zipcode',
      sortType: 'number',
      accessor: listing => listing.zipCode,
      render: ({ row: listing }) => `Zip: ${listing.zipCode}`
    }
  ]

  return (
    <Box p={theme.spacing(0, 1, 1)}>
      <Table
        columns={columns}
        rows={sortedListings}
        totalRows={listings.info.total}
        loading={isFetching ? 'middle' : null}
        // summary={total => `${total} Listings`}
        LoadingStateComponent={LoadingComponent}
      />
    </Box>
  )
}

export default ListView
