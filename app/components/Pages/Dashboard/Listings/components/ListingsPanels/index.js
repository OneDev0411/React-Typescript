import _ from 'lodash'
import React from 'react'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import withPropsOnChange from 'recompose/withPropsOnChange'

import GridView from './GridView'
import TableView from './TableView'
import PanelHeader from './PanelHeader'
import PanelsSwitch from './PanelsSwitch'
import listingUtils from '../../../../../../utils/listing'

const ListingPanel = props => {
  const { tabName, listings, activePanel } = props

  const panelClassName = `c-listings-panel--${activePanel}`

  return (
    <div className={panelClassName}>
      <PanelsSwitch activePanel={activePanel} tabName={tabName} />
      {(tabName !== 'ALERTS' ||
        (tabName === 'ALERTS' && activePanel !== 'map')) &&
        <div className="l-listings__panel__container">
          {(tabName !== 'ALERTS' ||
            (tabName === 'ALERTS' && activePanel === 'table')) &&
            <PanelHeader {...props} info={listings.info} />}
          <div className="c-panel__list-container">
            {activePanel === 'table'
              ? <TableView {...props} />
              : <GridView {...props} />}
          </div>
        </div>}
    </div>
  )
}

const ListingPanelHOC = compose(
  withState('sortingIndex', 'setSortingIndex', 'price'),
  withState('sortingDirection', 'setSortingDirection', 1),
  withHandlers({
    onClickDropdownItem: ({ setSortingIndex }) => index => {
      setSortingIndex(index)
    },
    onClickSortingDirection: ({ setSortingDirection }) => event => {
      const dir = event.target.checked ? -1 : 1
      setSortingDirection(dir)
    }
  }),
  withPropsOnChange(
    ['listings', 'sortingIndex', 'sortingDirection'],
    ({ listings, sortingIndex, sortingDirection }) => {
      const { data, info } = listings

      const sortedListings = _.sortBy(listings.data, listing => {
        const getPropertyValue = prop =>
          ((listing.compact_property && listing.compact_property[prop]) ||
            (listing.property && listing.property[prop])) * sortingDirection

        switch (sortingIndex) {
          case 'area':
            return (
              ((listing.address && listing.address.postal_code) ||
                (listing.property && listing.property.address.postal_code)) *
              sortingDirection
            )
          case 'price':
            return listing.price * sortingDirection
          case 'bedrooms':
            return getPropertyValue('bedroom_count')
          case 'baths':
            return getPropertyValue('bathroom_count')
          case 'sqft':
            return getPropertyValue('square_meters')
          case '$/Sqft':
            return Math.floor(
              listing.price /
                listingUtils.metersToFeet(getPropertyValue('square_meters'))
            )
          case 'built':
            return getPropertyValue('yearBuilt')
          case 'distance':
            return (
              window.google &&
              window.currentMap &&
              google.maps.geometry.spherical.computeDistanceBetween(
                window.currentMap.getCenter(),
                new google.maps.LatLng(listing.lat, listing.lng)
              ) * sortingDirection
            )
          default:
            return listings.data
        }
      })

      const newListings = {
        info,
        data: sortedListings
      }

      return { listings: newListings }
    }
  )
)

export default ListingPanelHOC(ListingPanel)
