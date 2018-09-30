import React from 'react'

import Table from '../../../../../../views/components/Grid/Table'
import LoadingComponent from '../../../../../../views/components/Spinner'

import ListingCard from '../ListingCard'
import { formatListing } from '../../helpers/format-listing'
import { MainContainer, MapContainer, TableContainer } from './styled'

export class MapView extends React.Component {
  columns = [
    {
      id: 'price',
      accessor: listing => listing.price,
      render: ({ rowData: listing }) => (
        <ListingCard isShowOnMap listing={listing} key={listing.id} />
      )
    }
  ]

  getGridTrProps = () => ({
    style: {
      padding: 0,
      border: 'none'
    }
  })

  format = listing => formatListing(listing, this.props.user)

  sort = (a, b) => {
    const { index } = this.props.sortBy

    return this.props.sortBy.isDescending
      ? a[index] - b[index]
      : b[index] - a[index]
  }

  render() {
    return (
      <MainContainer>
        <MapContainer>{this.props.Map}</MapContainer>
        <TableContainer>
          <Table
            columns={this.columns}
            data={this.props.listings.data.map(this.format).sort(this.sort)}
            getTrProps={this.getGridTrProps}
            isFetching={this.props.isFetching}
            LoadingState={LoadingComponent}
            listInfo={this.props.listings.info}
            showTableHeader={false}
            summary={{ entityName: 'Listings' }}
            plugins={{
              sortable: {
                defaultIndex: { label: 'Price A-Z', value: 'price' },
                columns: [
                  { label: 'Price A-Z', value: 'price' },
                  { label: 'Price Z-A', value: '-price' },
                  { label: 'Bedrooms A-Z', value: 'beds' },
                  { label: 'Bedrooms Z-A', value: '-beds' },
                  { label: 'Bathrooms A-Z', value: 'baths' },
                  { label: 'Bathrooms Z-A', value: '-baths' },
                  { label: 'Sqft A-Z', value: 'sqft' },
                  { label: 'Sqft Z-A', value: '-sqft' },
                  { label: 'Lot Size Area A-Z', value: 'lotSizeArea' },
                  { label: 'Lot Size Area Z-A', value: '-lotSizeArea' },
                  { label: 'Year Built A-Z', value: 'builtYear' },
                  { label: 'Year Built Z-A', value: '-builtYear' }
                ],
                onChange: this.props.onChangeSort
              }
            }}
          />
        </TableContainer>
      </MainContainer>
    )
  }
}
