import React from 'react'

import pluralize from 'pluralize'

import { Box, useTheme } from '@material-ui/core'

import { useGridStyles } from 'components/Grid/Table/styles'

import Table from '../../../../../../views/components/Grid/Table'
import LoadingComponent from '../../../../../../views/components/Spinner'
import TableActions from '../../Search/components/BulkActions'

import { Address } from './columns/Address'
import { Avatar } from './columns/Avatar'

const ListView = ({ sortedListings, listings, isFetching, user }) => {
  const gridClasses = useGridStyles()
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
    <Box pb={1}>
      <Table
        columns={columns}
        rows={sortedListings}
        totalRows={listings.info.total}
        loading={isFetching ? 'middle' : null}
        LoadingStateComponent={LoadingComponent}
        selection={{
          defaultRender: ({ row: listing }) => <Avatar listing={listing} />,
          columnProps: {
            width: theme.spacing(4)
          }
        }}
        classes={{
          row: gridClasses.row
        }}
        TableActions={
          <TableActions
            isFetching={isFetching}
            totalRowsCount={listings.info.total}
            listings={listings.data}
            user={user}
          />
        }
      />
    </Box>
  )
}

export default ListView
