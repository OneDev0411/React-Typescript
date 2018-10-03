import React from 'react'

import Table from '../../../../../../views/components/Grid/Table'
import LoadingComponent from '../../../../../../views/components/Spinner'

import { formatListing } from '../../helpers/format-listing'
import { Address } from './columns/Address'

export class GridView extends React.Component {
  columns = [
    {
      header: 'Address',
      id: 'adress',
      width: '30%',
      render: ({ rowData: listing }) => <Address listing={listing} />
    },
    {
      header: 'Price',
      id: 'price',
      accessor: listing => listing.price,
      render: ({ rowData: listing }) => `$${listing.price.toLocaleString()}`
    },
    {
      header: 'Beds',
      id: 'beds',
      accessor: listing => listing.beds,
      render: ({ rowData: listing }) => listing.beds
    },
    {
      header: 'Baths',
      id: 'baths',
      accessor: listing => listing.baths,
      render: ({ rowData: listing }) => listing.baths
    },
    {
      header: 'sqft',
      id: 'sqft',
      accessor: listing => listing.sqft,
      render: ({ rowData: listing }) => listing.sqft.toLocaleString()
    },
    {
      header: '$/Sqft',
      id: 'pricePerSquareFoot',
      accessor: listing => listing.pricePerSquareFoot,
      render: ({ rowData: listing }) =>
        `$${listing.pricePerSquareFoot.toLocaleString()}`
    },
    {
      header: 'Built Year',
      id: 'year',
      accessor: listing => listing.builtYear,
      render: ({ rowData: listing }) => listing.builtYear
    },
    {
      header: 'Zip Code',
      id: 'zipcode',
      accessor: listing => listing.zipCode,
      render: ({ rowData: listing }) => listing.zipCode
    }
  ]

  format = listing => formatListing(listing, this.props.user)

  render() {
    return (
      <div style={{ padding: '1.5em 1.5em 0.5em' }}>
        <Table
          columns={this.columns}
          data={this.props.listings.data.map(this.format)}
          isFetching={this.props.isFetching}
          LoadingState={LoadingComponent}
          listInfo={this.props.listings.info}
          summary={{ entityName: 'Listings', style: { color: '#000' } }}
          getTdProps={() => ({ style: { lineHeight: 1 } })}
          plugins={{
            sortable: {}
          }}
        />
      </div>
    )
  }
}
