import React from 'react'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withPropsOnChange from 'recompose/withPropsOnChange'
import idx from 'idx'

import Table from '../../../../../../views/components/Grid/Table'
import LoadingComponent from '../../../../../../views/components/Spinner'
import { normalizeListingLocation } from '../../../../../../utils/map'

import ListingCard from '../ListingCard'
import { formatListing } from '../../helpers/format-listing'
import { sortOptions } from '../../helpers/sort-plugin-options'
import { MainContainer, MapContainer, TableContainer } from './styled'

const addListingsDistanceFromCenter = (listing, center) => {
  if (
    !center ||
    !idx(window, w => w.google.maps.geometry)
  ) {
    return listing
  }

  const { google } = window

  const centerLatLng = new google.maps.LatLng(center.lat, center.lng)

  const listingLocation = new google.maps.LatLng(
    listing.lat,
    listing.lng
  )

  const distanceFromCenter = google.maps.geometry.spherical.computeDistanceBetween(
    centerLatLng,
    listingLocation
  )

  return {
    ...listing,
    distanceFromCenter
  }
}

const format = (listing, center, user) =>
  addListingsDistanceFromCenter(
    formatListing(normalizeListingLocation(listing), user),
    center
  )

const sortBy = (a, b, index, isDescending) =>
  isDescending ? a[index] - b[index] : b[index] - a[index]

export class MapViewContainer extends React.Component {
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

  onChangeSort = ({ value: index }) => {
    const isDescending = index.charAt(0) === '-'

    if (isDescending) {
      index = index.slice(1)
    }

    this.props.changeSortBy({
      index,
      isDescending
    })
  }

  render() {
    return (
      <MainContainer>
        <MapContainer>{this.props.Map}</MapContainer>
        <TableContainer>
          <Table
            columns={this.columns}
            data={this.props.data}
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
                columns: [
                  ...sortOptions.columns,
                  { label: 'Distance (High-Low)', value: 'distanceFromCenter' },
                  { label: 'Distance (Low-High)', value: '-distanceFromCenter' }
                ],
                defaultIndex: sortOptions.defaultIndex,
                onChange: this.onChangeSort
              }
            }}
          />
        </TableContainer>
      </MainContainer>
    )
  }
}

export const MapView = compose(
  withState('sortBy', 'changeSortBy', {
    index: 'price',
    isDescending: true
  }),
  withPropsOnChange(
    (props, nextProps) =>
      props.listings.data.length !== nextProps.listings.data.length,
    ownerProps => ({
      formatedData: ownerProps.listings.data.map(l =>
        format(l, ownerProps.mapCenter, ownerProps.user)
      )
    })
  ),
  withPropsOnChange(
    (props, nextProps) =>
      props.formatedData.length !== nextProps.formatedData.length ||
      props.sortBy.index !== nextProps.sortBy.index ||
      props.sortBy.isDescending !== nextProps.sortBy.isDescending,
    ownerProps => ({
      data: ownerProps.formatedData.sort((a, b) =>
        sortBy(a, b, ownerProps.sortBy.index, ownerProps.sortBy.isDescending)
      )
    })
  )
)(MapViewContainer)
