import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withPropsOnChange from 'recompose/withPropsOnChange'

import GridView from './GridView'
import TableView from './TableView'
import PanelHeader from './PanelHeader'
import PanelsSwitch from './PanelsSwitch'
import listingUtils from '../../../../../../utils/listing'
import actions from '../../../../../../store_actions/listings/panels'

const ListingPanel = props => {
  const { tabName, listings, activePanel } = props

  const panelClassName = `c-listings-panel--${activePanel}`

  return (
    <div className={panelClassName}>
      <PanelsSwitch activePanel={activePanel} tabName={tabName} />
      {(tabName !== 'alerts' ||
        (tabName === 'alerts' && activePanel !== 'map')) && (
        <div className="l-listings__panel__container">
          {(tabName !== 'alerts' ||
            (tabName === 'alerts' && activePanel === 'table')) && (
            <PanelHeader {...props} info={listings.info} />
          )}
          <div className="c-panel__list-container">
            {activePanel === 'table' ? (
              <TableView {...props} />
            ) : (
              <GridView {...props} />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const ListingPanelHOC = compose(
  connect(
    (state, { tabName }) => {
      const { panels } = state[tabName.toLowerCase()]

      if (panels) {
        return { ...panels }
      }

      return null
    },
    actions
  ),
  withHandlers({
    onClickDropdownItem: ({ setPanelSortingIndex, tabName }) => index => {
      setPanelSortingIndex(tabName, index)
    },
    onClickSortingDirection: ({
      togglePanelSortingDirection,
      tabName
    }) => () => {
      togglePanelSortingDirection(tabName)
    }
  }),
  withPropsOnChange(
    (props, nextProps) =>
      !_.isEqual(props.sortingIndex, nextProps.sortingIndex) ||
      !_.isEqual(props.sortingDirection, nextProps.sortingDirection) ||
      !_.isEqual(props.listings, nextProps.listings),
    ({ listings, sortingIndex, sortingDirection }) => {
      const { data, info } = listings

      const sortedListings = _.sortBy(data, listing => {
        const getPropertyValue = prop =>
          ((listing.compact_property && listing.compact_property[prop]) ||
            (listing.property && listing.property[prop])) * sortingDirection ||
          0

        const getBathroomValue = () => {
          const { half_bathroom_count, full_bathroom_count } =
            listing.compact_property || listing.property

          return (half_bathroom_count + full_bathroom_count) * sortingDirection
        }

        const getZipCodes = () => {
          let zipCode =
            (listing.address && listing.address.postal_code) ||
            (listing.property && listing.property.address.postal_code)

          return zipCode * sortingDirection
        }

        switch (sortingIndex) {
          case 'Zip Code':
            return getZipCodes()
          case 'baths':
            return getBathroomValue()
          case 'price':
            return listing.price * sortingDirection
          case 'sqft':
            return getPropertyValue('square_meters')
          case 'built':
            return getPropertyValue('year_built')
          case 'bedrooms':
            return getPropertyValue('bedroom_count')
          case '$/sqft':
            return Math.floor(
              listing.price /
                listingUtils.metersToFeet(getPropertyValue('square_meters'))
            )
          case 'distance':
            const { latitude, longitude } =
              listing.location || listing.property.address.location

            if (latitude && longitude) {
              return (
                window.google &&
                window.currentMap &&
                google.maps.geometry.spherical.computeDistanceBetween(
                  window.currentMap.getCenter(),
                  new google.maps.LatLng(latitude, longitude)
                ) * sortingDirection
              )
            }

            return data
          default:
            return data
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
