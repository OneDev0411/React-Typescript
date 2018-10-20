import React from 'react'

import Table from '../../../../../../views/components/Grid/Table'
import LoadingComponent from '../../../../../../views/components/Spinner'
// import { CreateTour } from '../../../../../../views/components/tour/CreateTour'

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

  // actions = [
  //   {
  //     display: ({ selectedRows }) => selectedRows.length > 0,
  //     render: ({ selectedRows }) => {
  //       const listings = this.props.listings.data.filter(l =>
  //         selectedRows.some(id => id === l.id)
  //       )

  //       return <CreateTour listings={listings} user={this.props.user} />
  //     }
  //   }
  // ]

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
          plugins={{
            sortable: {
              // columns: [
              //   { label: 'Address A-Z', value: 'address' },
              //   { label: 'Address Z-A', value: '-address' },
              //   { label: 'Price (Lo - Hi)', value: 'price' },
              //   { label: 'Price (Hi - Lo)', value: '-price' },
              //   { label: 'Beds (Lo - Hi)', value: 'beds' },
              //   { label: 'Beds (Hi - Lo)', value: '-beds' },
              //   { label: 'Baths (Lo - Hi)', value: 'baths' },
              //   { label: 'Baths (Hi - Lo)', value: '-baths' },
              //   { label: 'Sqft (Lo - Hi)', value: 'sqft' },
              //   { label: 'Sqft (Hi - Lo)', value: '-sqft' },
              //   { label: '$/Sqft (Lo - Hi)', value: '$/sqft' },
              //   { label: '$/Sqft (Hi - Lo)', value: '-$/sqft' },
              //   { label: 'Year Built (Lo - Hi)', value: 'builtYear' },
              //   { label: 'Year Built (Hi - Lo)', value: '-builtYear' }
              // ]
            }
            // actionable: {
            //   actions: this.actions
            // },
            // selectable: {
            //   persistent: true,
            //   storageKey: 'listings'
            // }
          }}
        />
      </div>
    )
  }
}
