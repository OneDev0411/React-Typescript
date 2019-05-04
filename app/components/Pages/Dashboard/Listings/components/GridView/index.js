import React from 'react'

import Table from '../../../../../../views/components/Grid/Table'
import LoadingComponent from '../../../../../../views/components/Spinner'

import { formatListing } from '../../helpers/format-listing'
import { Address } from './columns/Address'

export class GridView extends React.Component {
  columns = [
    {
      header: 'Address',
      id: 'address',
      width: '30%',
      render: ({ rowData: listing }) => <Address listing={listing} />
    },
    {
      header: 'Price',
      id: 'price',
      sortType: 'number',
      accessor: listing => listing.price,
      render: ({ rowData: listing }) => `$${listing.price.toLocaleString()}`
    },
    {
      header: 'Beds',
      id: 'beds',
      sortType: 'number',
      accessor: listing => listing.beds,
      render: ({ rowData: listing }) => listing.beds
    },
    {
      header: 'Baths',
      id: 'baths',
      sortType: 'number',
      accessor: listing => listing.baths,
      render: ({ rowData: listing }) => listing.baths
    },
    {
      header: 'sqft',
      id: 'sqft',
      sortType: 'number',
      accessor: listing => listing.sqft,
      render: ({ rowData: listing }) => listing.sqft.toLocaleString()
    },
    {
      header: '$/Sqft',
      sortType: 'number',
      id: 'pricePerSquareFoot',
      accessor: listing => listing.pricePerSquareFoot,
      render: ({ rowData: listing }) =>
        `$${listing.pricePerSquareFoot.toLocaleString()}`
    },
    {
      header: 'Built Year',
      id: 'year',
      sortType: 'number',
      accessor: listing => listing.builtYear,
      render: ({ rowData: listing }) => listing.builtYear
    },
    {
      header: 'Zip Code',
      id: 'zipcode',
      sortType: 'number',
      accessor: listing => listing.zipCode,
      render: ({ rowData: listing }) => listing.zipCode
    }
  ]

  format = listing => formatListing(listing, this.props.user)

  render() {
    return (
      <div style={{ padding: ' 0 1.5em 1.5em' }}>
        <Table
          columns={this.columns}
          data={this.props.listings.data.map(this.format)}
          isFetching={this.props.isFetching}
          LoadingState={LoadingComponent}
          summary={{
            entityName: 'Listings',
            style: { color: '#000' },
            total: this.props.listings.info.total
          }}
          plugins={{
            sortable: {},
            ...this.props.plugins
          }}
        />
      </div>
    )
  }
}
