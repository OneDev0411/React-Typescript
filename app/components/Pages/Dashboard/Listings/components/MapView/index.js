import React from 'react'

import Table from '../../../../../../views/components/Grid/Table'
import LoadingComponent from '../../../../../../views/components/Spinner'

import ListingCard from '../ListingCard'
import { MainContainer, MapContainer, TableContainer } from './styled'

class MapView extends React.Component {
  columns = [
    {
      id: 'price',
      accessor: listing => listing.price,
      render: ({ row: listing }) => (
        <ListingCard
          isShowOnMap
          key={listing.id}
          listing={listing}
          tabName={this.props.tabName}
        />
      )
    }
  ]

  render() {
    return (
      <MainContainer>
        <MapContainer>{this.props.Map}</MapContainer>
        <TableContainer>
          <Table
            columns={this.columns}
            rows={this.props.sortedListings}
            loading={this.props.isFetching ? 'middle' : null}
            LoadingStateComponent={LoadingComponent}
            totalRows={this.props.listings.info.total}
            summary={total => `${total} Listings`}
            getTrProps={() => ({
              style: {
                padding: 0,
                border: 'none'
              }
            })}
            getTdProps={() => ({ style: { padding: 0 } })}
          />
        </TableContainer>
      </MainContainer>
    )
  }
}

// export const MapView = compose(
//   withState('sortBy', 'changeSortBy', {
//     index: 'price',
//     isDescending: true
//   }),
//   withPropsOnChange(
//     (props, nextProps) =>
//       props.listings.data.length !== nextProps.listings.data.length,
//     ownerProps => ({
//       formatedData: ownerProps.listings.data.map(l =>
//         format(l, ownerProps.mapCenter, ownerProps.user)
//       )
//     })
//   ),
//   withPropsOnChange(
//     (props, nextProps) =>
//       props.formatedData.length !== nextProps.formatedData.length ||
//       props.sortBy.index !== nextProps.sortBy.index ||
//       props.sortBy.isDescending !== nextProps.sortBy.isDescending,
//     ownerProps => ({
//       data: ownerProps.formatedData.sort((a, b) =>
//         sortBy(a, b, ownerProps.sortBy.index, ownerProps.sortBy.isDescending)
//       )
//     })
//   )
// )(MapViewContainer)

export default MapView
