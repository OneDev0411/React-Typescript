import React from 'react'

import Table from '../../../../../../views/components/Grid/Table'
import LoadingComponent from '../../../../../../views/components/Spinner'

import ListingCard from '../ListingCard'
import { formatListing } from '../../helpers/format-listing'
import { sortOptions } from '../../helpers/sort-plugin-options'
import { MainContainer, MapContainer, TableContainer } from './styled'

export class MapView extends React.Component {
  state = {
    sortBy: {
      index: 'price',
      isDescending: false
    }
  }

  columns = [
    {
      id: 'price',
      accessor: listing => listing.price,
      render: ({ rowData: listing }) => (
        <ListingCard
          isShowOnMap
          key={listing.id}
          listing={listing}
          tabName={this.props.tabName}
        />
      )
    }
  ]

  format = listing => formatListing(listing, this.props.user)

  addListingsDistanceFromCenter = listing => {
    const { google } = window

    if (!google || !this.props.mapCenter) {
      return listing
    }

    const center = new window.google.maps.LatLng(
      this.props.mapCenter.lat,
      this.props.mapCenter.lng
    )

    const listingLocation = new window.google.maps.LatLng(
      listing.location.latitude,
      listing.location.longitude
    )

    const distanceFromCenter = google.maps.geometry.spherical.computeDistanceBetween(
      center,
      listingLocation
    )

    return {
      ...listing,
      distanceFromCenter
    }
  }

  onChangeSort = ({ value: index }) => {
    const isDescending = index.charAt(0) === '-'

    if (isDescending) {
      index = index.slice(1)
    }

    this.setState({
      sortBy: {
        index,
        isDescending
      }
    })
  }

  sort = (a, b) => {
    const { index } = this.state.sortBy

    return this.state.sortBy.isDescending
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
            data={this.props.listings.data
              .map(this.format)
              .map(this.addListingsDistanceFromCenter)
              .sort(this.sort)}
            isFetching={this.props.isFetching}
            LoadingState={LoadingComponent}
            listInfo={this.props.listings.info}
            showTableHeader={false}
            summary={{ entityName: 'Listings', style: { color: '#000' } }}
            getTrProps={() => ({
              style: {
                padding: 0,
                border: 'none'
              }
            })}
            getTdProps={() => ({ style: { padding: 0 } })}
            plugins={{
              sortable: {
                ...sortOptions,
                onChange: this.onChangeSort
              }
            }}
          />
        </TableContainer>
      </MainContainer>
    )
  }
}
