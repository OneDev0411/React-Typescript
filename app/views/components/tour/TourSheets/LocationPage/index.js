import React from 'react'
import PropTypes from 'prop-types'

import { getUserTitle } from '../../../../../models/user/helpers/get-user-title'
import {
  getListingAddressObj,
  isLeaseProperty
} from '../../../../../utils/listing'
import {
  joinItemsWithString,
  getIndexLabel
} from '../../../../../utils/helpers'
import { H1 } from '../../../Typography/headings'
import IconPin from '../../../SvgIcons/MapPinOn/IconMapPinOn'
import { prepareListingsProperties } from '../../../../../components/Pages/Dashboard/Listings/helpers/prepare-listings-properties'

import { getFormatedDueDate } from '../helpers/get-formated-due-date'

import '../styles/shared.scss'
import './style.scss'

const propTypes = {
  listing: PropTypes.shape().isRequired,
  agent: PropTypes.shape().isRequired,
  tour: PropTypes.shape().isRequired
}

const TOUR_SHEETS = 'c-tour-sheets'
const LOCATION_PAGE = 'c-tour-sheets__location-page'

export function LocationPage(props) {
  const { agent, tour, listing } = props

  const listingData = prepareListingsProperties(props.agent, listing)

  const addressData = getListingAddressObj(listing)
  const { neighborhood, city, state, postal_code } = addressData

  const pageMeta = joinItemsWithString(
    [
      getUserTitle(agent),
      agent.email,
      agent.phone_number,
      getFormatedDueDate(tour)
    ],
    ' | '
  )

  const listing_subtitle = `${neighborhood ? `${neighborhood} - ` : ''}${
    city ? `${city}, ` : ''
  } ${state} ${postal_code}`

  const summary = joinItemsWithString(
    [
      `${listingData.beds} Beds`,
      `${listingData.baths} Baths`,
      `${listingData.sqft.toLocaleString()} sqft`,
      `${listingData.lotSizeArea.toLocaleString()} sqft lot size`
    ],
    ' . '
  )

  const details = [
    { label: 'Country', value: city },
    { label: 'Property Type', value: listingData.propertyType },
    { label: 'Price per Square Foot', value: listingData.pricePerSquareFoot },
    { label: 'Year Built', value: listingData.builtYear }
  ]

  return (
    <div className={`${TOUR_SHEETS}__page ${LOCATION_PAGE}`}>
      <p
        style={{
          padding: '1.5rem 0 0.5rem',
          fontSize: '0.635rem',
          textAlign: 'center',
          borderBottom: '1px solid #d4d4d4'
        }}
      >
        {pageMeta}
      </p>

      <div style={{ display: 'flex' }}>
        <div
          style={{
            width: '14.5rem',
            marginRight: '1rem'
          }}
        >
          <div
            style={listingData.backgroundImage}
            className={`${LOCATION_PAGE}__image u-print-bg`}
          >
            <div className={`${LOCATION_PAGE}__location-index u-print-bg`}>
              <IconPin />
              {getIndexLabel(props.index)}
            </div>
          </div>
          <div>
            {[...Array(10).keys()].map((n, i) => (
              <div
                key={i}
                className={`${LOCATION_PAGE}__note-lines u-print-bg`}
              />
            ))}
          </div>
        </div>
        <div
          style={{
            width: 'calc(100% - 14.5rem)'
          }}
        >
          <H1 className={`${LOCATION_PAGE}__title u-print-bg`}>
            {listingData.address}
          </H1>
          <div style={{ marginBottom: '0.25rem' }}>{listing_subtitle}</div>
          <div style={{ marginBottom: '1rem' }}>
            MLS#: <div style={{ display: 'inline' }}>{listing.mls_number}</div>
          </div>
          <div style={{ fontWeight: 600 }}>
            {`$${listing.price.toLocaleString()}`}
            {isLeaseProperty(listing) ? '/mo' : ''}
          </div>
          <p style={{ fontWeight: 500, fontSize: '0.625rem' }}>{summary}</p>
          <p className={`${LOCATION_PAGE}__description`}>
            {listingData.description}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {details.map((d, i) => (
              <div
                key={i}
                style={{
                  width: '50%',
                  marginBottom: '0.5rem',
                  paddingRight: '1em'
                }}
              >
                <div style={{ color: '#7f7f7f' }}>{d.label}</div>
                <div>{d.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`${TOUR_SHEETS}__brand-line`} />
    </div>
  )
}

LocationPage.propTypes = propTypes
