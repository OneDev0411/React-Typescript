import React from 'react'

import Table from '../../../../../../views/components/Grid/Table'
import LoadingComponent from '../../../../../../views/components/Spinner'

import { Address } from './columns/Address'

class ListView extends React.Component {
  columns = [
    {
      header: 'Address',
      id: 'address',
      width: '30%',
      render: ({ row: listing }) => <Address listing={listing} />
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
      render: ({ row: listing }) => listing.beds
    },
    {
      header: 'Baths',
      id: 'baths',
      sortType: 'number',
      accessor: listing => listing.baths,
      render: ({ row: listing }) => listing.baths
    },
    {
      header: 'sqft',
      id: 'sqft',
      sortType: 'number',
      accessor: listing => listing.sqft,
      render: ({ row: listing }) => listing.sqft.toLocaleString()
    },
    {
      header: '$/Sqft',
      sortType: 'number',
      id: 'pricePerSquareFoot',
      accessor: listing => listing.pricePerSquareFoot,
      render: ({ row: listing }) =>
        `$${listing.pricePerSquareFoot.toLocaleString()}`
    },
    {
      header: 'Built Year',
      id: 'year',
      sortType: 'number',
      accessor: listing => listing.builtYear,
      render: ({ row: listing }) => listing.builtYear
    },
    {
      header: 'Zip Code',
      id: 'zipcode',
      sortType: 'number',
      accessor: listing => listing.zipCode,
      render: ({ row: listing }) => listing.zipCode
    }
  ]

  render() {
    return (
      <div style={{ padding: ' 0 1.5em 1.5em' }}>
        <Table
          columns={this.columns}
          rows={this.props.sortedListings}
          totalRows={this.props.listings.info.total}
          loading={this.props.isFetching ? 'middle' : null}
          summary={total => `${total} Listings`}
          LoadingStateComponent={LoadingComponent}
          hasHeader
          stickyHeader
        />
      </div>
    )
  }
}

export default ListView
