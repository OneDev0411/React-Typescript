import { mdiMapMarkerOutline } from '@mdi/js'
import pluralize from 'pluralize'
import PropTypes from 'prop-types'

import { getFormattedPrice } from '@app/models/Deal/helpers/context'
import {
  addressTitle,
  isLeaseProperty,
  getListingAddressLine2,
  getListingAddressObj,
  getListingFeatures,
  getListingPricePerSquareFoot
} from '@app/utils/listing'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { getUserTitle } from '../../../../../models/user/helpers/get-user-title'
import {
  joinItemsWithString,
  getIndexLabel
} from '../../../../../utils/helpers'
import { H1 } from '../../../Typography/headings'
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
const MAIN_IMAGE_PLACEHOLDER_SRC = '/static/images/listing/large.jpg'
export function LocationPage(props) {
  const { agent, tour, listing } = props

  const city = getListingAddressObj(listing).city

  const listingFeatures = getListingFeatures(listing)
  const pageMeta = joinItemsWithString(
    [
      getUserTitle(agent),
      agent.email,
      agent.phone_number,
      getFormatedDueDate(tour)
    ],
    ' | '
  )
  const listingAddress = addressTitle(listing.property.address)
  const listing_subtitle = getListingAddressLine2(listing)

  const summary = joinItemsWithString(
    [
      `${listingFeatures.bedroomCount} ${pluralize(
        'bed',
        listingFeatures.bedroomCount
      )}`,
      `${listingFeatures.bathroomCount} ${pluralize(
        'Bath',
        listingFeatures.bathroomCount
      )}`,
      ...(listingFeatures.areaSqft
        ? [`${listingFeatures.areaSqft.toLocaleString()} sqft`]
        : []),
      ...(listingFeatures.lotSizeAreaAcre
        ? [`${listingFeatures.lotSizeAreaAcre.toLocaleString()} sqft lot size`]
        : [])
    ],
    ' . '
  )

  const property =
    listing.type === 'compact_listing'
      ? listing.compact_property
      : listing.property

  const details = [
    { label: 'Country', value: city },
    { label: 'Property Type', value: property.property_type },
    {
      label: 'Price per Square Foot',
      value: getListingPricePerSquareFoot(listing)
    },
    { label: 'Year Built', value: property.year_built }
  ]

  const image = listing.gallery_image_urls?.length
    ? listing.gallery_image_urls[0]
    : MAIN_IMAGE_PLACEHOLDER_SRC

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
            style={{ backgroundImage: `url("${image}")` }}
            className={`${LOCATION_PAGE}__image u-print-bg`}
          >
            <div className={`${LOCATION_PAGE}__location-index u-print-bg`}>
              <SvgIcon path={mdiMapMarkerOutline} />
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
            {listingAddress}
          </H1>
          <div style={{ marginBottom: '0.25rem' }}>{listing_subtitle}</div>
          <div style={{ marginBottom: '1rem' }}>
            MLS#: <div style={{ display: 'inline' }}>{listing.mls_number}</div>
          </div>
          <div style={{ fontWeight: 600 }}>
            {`${getFormattedPrice(listing.price, 'currency', 0)}`}
            {isLeaseProperty(listing) ? '/mo' : ''}
          </div>
          <p style={{ fontWeight: 500, fontSize: '0.625rem' }}>{summary}</p>
          <p className={`${LOCATION_PAGE}__description`}>
            {property.description}
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
