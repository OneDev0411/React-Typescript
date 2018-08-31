import React from 'react'
import { connect } from 'react-redux'

import Table from '../../../../../../../views/components/Grid/Table'
import { Address } from './columns/Address'
import prepareListingViewItemProps from '../prepareListingViewItemProps'

class TableView extends React.Component {
  getProp = (listing, prop) => {
    const props = prepareListingViewItemProps(this.props.user, listing)

    return props[prop] || ''
  }

  columns = [
    {
      header: 'Address',
      id: 'adress',
      width: '30%',
      accessor: null,
      render: ({ rowData: listing }) => (
        <Address user={this.props.user} listing={listing} />
      )
    },
    {
      header: 'Price',
      id: 'price',
      accessor: listing => this.getProp(listing, 'price'),
      render: ({ rowData: listing }) => this.getProp(listing, 'price')
    },
    {
      header: 'Beds',
      id: 'beds',
      accessor: listing => this.getProp(listing, 'beds'),
      render: ({ rowData: listing }) => this.getProp(listing, 'beds')
    },
    {
      header: 'Baths',
      id: 'baths',
      accessor: listing => this.getProp(listing, 'baths'),
      render: ({ rowData: listing }) => this.getProp(listing, 'baths')
    },
    {
      header: 'sqft',
      id: 'sqft',
      accessor: listing => this.getProp(listing, 'sqft'),
      render: ({ rowData: listing }) => this.getProp(listing, 'sqft')
    },
    {
      header: '$/Sqft',
      id: 'pricePerSquareFoot',
      accessor: listing => this.getProp(listing, 'pricePerSquareFoot'),
      render: ({ rowData: listing }) =>
        this.getProp(listing, 'pricePerSquareFoot')
    },
    {
      header: 'Built Year',
      id: 'year',
      accessor: listing => this.getProp(listing, 'builtYear'),
      render: ({ rowData: listing }) => this.getProp(listing, 'builtYear')
    },
    {
      header: 'Zip Code',
      id: 'zipcode',
      accessor: listing => this.getProp(listing, 'zipCode'),
      render: ({ rowData: listing }) => this.getProp(listing, 'zipCode')
    }
  ]

  render() {
    return (
      <Table
        columns={this.columns}
        data={this.props.listings.data}
        plugins={{
          sortable: {}
        }}
      />
    )
  }
}

export default connect(({ user }) => ({ user }))(TableView)
