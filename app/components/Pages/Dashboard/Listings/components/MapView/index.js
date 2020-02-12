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

  renderMain() {
    if (this.props.isFetching) {
      return <LoadingComponent />
    }

    return this.props.sortedListings.map(listing => (
      <ListingCard
        isShowOnMap
        key={listing.id}
        listing={listing}
        tabName={this.props.tabName}
      />
    ))
  }

  render() {
    return (
      <MainContainer>
        <MapContainer>{this.props.Map}</MapContainer>
        <TableContainer>{this.renderMain()}</TableContainer>
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
