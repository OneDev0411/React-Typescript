import React from 'react'
import S from 'shorti'
import Map from 'google-map-react'
import ReactSwipe from 'react-swipe'

import config from '../../../../../../../config/public'

import listingUtils from '../../../../../../utils/listing'
import { formatPhoneNumber } from '../../../../../../utils/format'

import { friendlyDate, numberWithCommas } from '../../../../../../utils/helpers'

import Brand from '../../../../../../controllers/Brand'

import Loading from '../../../../../Partials/Loading'

import ListingMarker from '../../components/ListingMarker'

import MLSNote from './MLSNote'
import ClaimAccountBanner from './ClaimAccountBanner'
import FetchError from './FetchError'
import { renderFeatures } from './ListingDesktopView'

const ListingMobileView = ({
  brand,
  user,
  listing,
  isFetching,
  errorMessage
}) => {
  const brand_agent = listing.proposed_agent
  let current_slide

  if (listing) {
    current_slide = listing.current_slide
  }

  if (!current_slide) {
    current_slide = 0
  }

  let price
  let address
  let property
  let lot_size
  let mls_number
  let year_built
  let square_feet
  let description
  let price_sq_foot
  let bedroom_count
  let listing_title
  let bathroom_count
  let listing_subtitle
  let brand_agent_area

  let listing_images = (
    <div
      style={S(
        'bg-eff1f2 w-100p h-300 font-22 text-center pt-125 color-929292'
      )}
    >
      No image
    </div>
  )

  let main_content = isFetching && <Loading />

  main_content = !isFetching && errorMessage && (
    <FetchError message={errorMessage} />
  )

  if (listing && listing.property) {
    property = listing.property
    price = listing.price

    if (listing.close_price && user && user.user_type === 'Agent') {
      price = listing.close_price
    }

    price = numberWithCommas(price)
    year_built = property.year_built
    address = listingUtils.addressTitle(property.address)
    listing_title = address
    mls_number = listing.mls_number
    bedroom_count = property.bedroom_count
    bathroom_count = property.bathroom_count
    square_feet = numberWithCommas(
      Math.floor(listingUtils.metersToFeet(property.square_meters))
    )

    if (property.square_meters) {
      price_sq_foot = (
        Number(price.replace(/,/g, '')) / Number(square_feet.replace(/,/g, ''))
      ).toFixed(2)
    }

    if (property.lot_size_area) {
      lot_size = property.lot_size_area
    }

    description = property.description

    const { gallery_image_urls } = listing

    listing_images = (
      <ReactSwipe className="carousel" swipeOptions={{ continuous: false }}>
        {gallery_image_urls.map((gallery_image_url, i) => (
          <div key={`gallery-image-${gallery_image_url}${i}`}>
            <div
              style={S(
                `w-100p h-300 pull-left text-center bg-efefef bg-cover bg-center bg-url(${listingUtils.getResizeUrl(
                  gallery_image_url
                )}?w=500)`
              )}
            />
          </div>
        ))}
      </ReactSwipe>
    )

    // Cache images for uninteruted scroll
    const listing_images_cached = gallery_image_urls.map((image_url, i) => (
      <img
        alt="gallery"
        key={`image-${i}`}
        src={`${listingUtils.getResizeUrl(image_url)}?w=500`}
        style={S('w-0 h-0')}
      />
    ))

    listing_subtitle = `${listing.property.address.city}, ${
      listing.property.address.state
    } ${listing.property.address.postal_code}`

    const status_color = listingUtils.getStatusColor(listing.status)

    let sold_date

    if (listing.close_date) {
      const sold_date_obj = friendlyDate(listing.close_date)

      sold_date = `${sold_date_obj.month} 
      ${sold_date_obj.date}, 
      ${sold_date_obj.year}`
    }

    const listing_status_indicator = (
      <div
        className="pull-left"
        style={S('bg-ebeef1 relative t-7 br-100 pt-11 h-35 pl-36 pr-15 mr-15')}
      >
        <span
          style={S(`mr-5 font-46 l-10 t-22n absolute color-${status_color}`)}
        >
          &#8226;
        </span>
        <span style={S('font-14 relative t-5n')}>
          <b>
            {listing.status} {sold_date}
          </b>
        </span>
      </div>
    )

    let mls_link

    if (mls_number) {
      mls_link = (
        <span>
          | MLS#:&nbsp;
          <span style={S('color-8ba8d1 pointer')}>{mls_number}</span>
        </span>
      )
    }

    let lot_size_area

    if (lot_size) {
      lot_size_area = (
        <span>
          &nbsp;&nbsp;&nbsp;&middot;&nbsp;&nbsp;&nbsp;
          <span>{lot_size ? `Lot size ${lot_size}` : ''}</span>
        </span>
      )
    }

    // Agent info
    if (brand_agent) {
      let profile_image_area

      if (brand_agent.cover_image_url) {
        profile_image_area = (
          <div style={{ textAlign: 'center' }}>
            <img
              alt="agent"
              style={{ maxWidth: '100%' }}
              src={brand_agent.cover_image_url}
            />
          </div>
        )
      }

      let phone_area

      if (brand_agent.phone_number) {
        phone_area = (
          <div style={S('font-15 mb-5')}>
            M: {formatPhoneNumber(brand_agent.phone_number)}
          </div>
        )
      }

      brand_agent_area = (
        <div style={S('mt-50 color-bfc3c7 w-100p text-left relative')}>
          {profile_image_area}
          <div style={S('bg-263445 p-20 w-100p')}>
            <div style={S('font-18 mb-5 color-fff')}>
              <span style={S('fw-400')}>
                {brand_agent.first_name} {brand_agent.last_name}
              </span>
            </div>
            <div style={S('font-14 mb-5 color-bfc3c7')}>
              <div
                style={S(
                  `bg-cover bg-url(${Brand.asset(
                    'office_logo'
                  )}) bg-center w-20 h-20 pull-left mr-10`
                )}
              />
              <div style={S('pull-left')}>{Brand.message('office_title')}</div>
              <div className="clearfix" />
            </div>
            {phone_area}
            <div style={S('font-15 mb-5')}>E: {brand_agent.email}</div>
          </div>
        </div>
      )
    }

    let list_agent_area

    if (user && user.user_type === 'Agent') {
      const email_style = {
        ...S('font-15 mb-20'),
        wordWrap: 'break-word'
      }

      // TODO New Listing Info
      let showing_instructions

      if (listing.showing_instructions) {
        showing_instructions = (
          <div style={S('font-15 mb-5')}>{showing_instructions}</div>
        )
      }

      list_agent_area = (
        <div
          style={S(
            'mt-20 color-748090 w-100p border-1-solid-ededed br-3 p-20 text-center'
          )}
        >
          <div style={S('font-18 mb-5 color-3388ff')}>
            <span style={S('fw-400')}>
              {listing.list_agent_full_name}, Seller Agent
            </span>
          </div>
          <div style={S('font-15 mb-5')}>
            {listing.list_agent_direct_work_phone}
          </div>
          <div style={S('font-15 mb-5')}>{listing.list_office_name}</div>
          {showing_instructions}
          <div style={email_style}>
            <a
              href={`mailto:${
                listing.list_agent_email
              }?subject=Your listing on Rechat.com&body=I saw your listing (${listing_title}) on Rechat.com and I'm interested in getting more information.`}
              style={S('color-748090')}
            >
              {listing.list_agent_email}
            </a>
          </div>
          <div
            style={S('border-bottom-2-solid-e4e4e4 w-40 center-block mb-5')}
          />
        </div>
      )
    }

    let latitude
    let longitude
    let location_area

    if (listing.property.address.location) {
      latitude = listing.property.address.location.latitude
      longitude = listing.property.address.location.longitude

      const bootstrap_url_keys = {
        key: config.google.api_key,
        libraries: ['drawing', 'places'].join(',')
      }

      location_area = (
        <div>
          <div style={{ padding: '0 1rem' }}>
            <div style={S('fw-600 font-18 mb-10')}>
              Location
              <div className="clearfix" />
            </div>
          </div>
          <div style={S('relative w-100p pull-left')}>
            <Map
              zoom={12}
              key="map"
              style={S('w-100p h-300')}
              bootstrapURLKeys={bootstrap_url_keys}
              center={{ lat: latitude, lng: longitude }}
              options={{ scrollwheel: false, draggable: false }}
            >
              <div
                style={{
                  cursor: 'pointer',
                  marginTop: '0.5rem'
                }}
              >
                <ListingMarker user={user} brand={brand} listing={listing} />
              </div>
            </Map>
          </div>
        </div>
      )
    }

    let asking_price_area

    if (listing.close_price && user && user.user_type === 'Client') {
      asking_price_area = (
        <span style={S('font-14 relative color-ccc fw-400')}>
          (Asking price)
        </span>
      )
    }

    main_content = (
      <div style={S('bg-fff relative z-1000')}>
        <div style={S('p-0 relative')}>
          <div className="clearfix" />
          {listing_images}
          {listing_images_cached}
          <div className="clearfix" />
        </div>
        <div>
          <div style={{ padding: '0 1rem' }}>
            <div style={S('fw-700 font-30')}>
              ${price}
              {listingUtils.isLeaseProperty(listing) ? '/mo' : ''}{' '}
              {asking_price_area}
            </div>
            <div>
              <div
                className="tempo"
                style={S('font-20 fw-100 color-7d8288 mb-10 mr-20')}
              >
                {listing_title}
              </div>
              <div style={S('mb-20')}>
                {listing_status_indicator}
                <div className="clearfix" />
              </div>
            </div>
            <div className="clearfix" />
            <div style={S('font-18 color-b7bfc7 mb-15')}>
              {listing_subtitle} {mls_link}
            </div>
            <div style={S('font-18 color-4a4a4a')}>
              <span>{bedroom_count} Beds</span>
              &nbsp;&nbsp;&nbsp;&middot;&nbsp;&nbsp;&nbsp;
              <span>{bathroom_count} Baths</span>
              &nbsp;&nbsp;&nbsp;&middot;&nbsp;&nbsp;&nbsp;
              <span>{square_feet} Sqft</span>
              &nbsp;&nbsp;&nbsp;&middot;&nbsp;&nbsp;&nbsp;
              <span>{year_built ? `Built in ${year_built}` : ''}</span>
              {lot_size_area}
            </div>
          </div>
          <div style={{ padding: '0 1rem', marginBottom: '1rem' }}>
            {brand_agent_area}
            {list_agent_area}
          </div>
          <div className="clearfix" />
          <div style={S('mb-20')}>
            {location_area}
            <div className="clearfix" />
          </div>
          <div>
            <div style={{ padding: '0 1rem' }}>
              <div style={S('fw-600 font-18 mb-10')}>Description</div>
              <div style={S('color-4a4a4a font-18 mb-20 pr-30')}>
                {description}
              </div>
            </div>
            <div className="clearfix" />
          </div>
          <div style={{ padding: '0 1rem' }}>
            <div style={S('mb-15 font-15')}>
              <div style={S('pr-20')}>
                <div style={S('mb-20')}>
                  <div style={S('fw-600 font-18 mb-10')}>Cost Breakdown</div>
                  {renderFeatures('Price/sqt', `$${price_sq_foot}`)}
                  {renderFeatures(
                    'Unexempt Taxes',
                    listing.unexempt_taxes ? `$${listing.unexempt_taxes}` : '0'
                  )}
                  {renderFeatures(
                    'HOA Fee',
                    listing.association_fee ? listing.association_fee : '0'
                  )}
                  {renderFeatures(
                    'HOA Frequency',
                    listing.association_fee_frequency
                  )}
                  {renderFeatures(
                    'HOA Includes',
                    listing.association_fee_includes
                  )}
                </div>
              </div>
              <div style={S('pr-20 mb-20')}>
                <div style={S('fw-600 mb-10 font-18')}>Key Facts</div>
                {renderFeatures('Year Built', property.year_built)}
                {renderFeatures('Style of House', property.architectural_style)}
                {renderFeatures('Subdivition', property.subdivition_name)}
                {renderFeatures('Acres', property.lot_size_area)}
                {renderFeatures('Stories', property.number_of_stories)}
                {renderFeatures('MLS#', listing.mls_number)}
                {renderFeatures('Possession', listing.possession)}
                {renderFeatures(
                  'Days On Market',
                  listingUtils.getDOM(listing.dom)
                )}
                {renderFeatures(
                  'Current Days On Market',
                  listingUtils.getDOM(listing.cdom)
                )}
              </div>
              <div style={S('pr-20')}>
                <div style={S('fw-600 font-18 mb-10')}>
                  Amenities & Utilities
                </div>
                {renderFeatures('Pool', property.pool_yn)}
                {renderFeatures('Pool Features', property.pool_features)}
                {renderFeatures('Handicap Amenities', property.handicap_yn)}
                {renderFeatures('Heating/Cooling', property.heating)}
                {renderFeatures('Others', property.utilities)}
              </div>
              <div className="clearfix" />
            </div>
            <div className="clearfix" />
            <div style={S('font-15')}>
              <div style={S('pr-20')}>
                <div style={S('fw-600 font-18 mb-10')}>All Features</div>
                {renderFeatures(
                  'Parking Spaces',
                  property.parking_spaces_covered_total
                )}
                {renderFeatures(
                  'Interior Features',
                  property.interior_features
                )}
                {renderFeatures('Alarm/Security', property.security_features)}
                {renderFeatures('Flooring', property.flooring)}
              </div>
              <div style={S('pr-20 mb-20')}>
                {renderFeatures(
                  'Exterior Features',
                  property.exterior_features
                )}
                {renderFeatures(
                  'Construction',
                  property.construction_materials
                )}
                {renderFeatures('Foundation', property.foundation_details)}
                {renderFeatures('Roof', property.roof)}
              </div>
              <div style={S('pr-20 mb-20')}>
                <div style={S('fw-600 font-18 mb-10')}>Schools</div>
                {renderFeatures('School District', property.school_district)}
                {renderFeatures(
                  'Elementary School',
                  property.elementary_school_name
                )}
                {renderFeatures('Middle School', property.middle_school_name)}
                {renderFeatures(
                  'Junior High School',
                  property.junior_high_school_name
                )}
                {renderFeatures(
                  'Senior High School',
                  property.senior_high_school_name
                )}
              </div>
              <div className="clearfix" />
            </div>
          </div>
          <div className="clearfix" />
          {listing && (
            <div style={{ padding: '0 1rem 2rem', marginTop: '-1em' }}>
              <MLSNote mls={listing.mls} mlsName={listing.mls_name} />
            </div>
          )}
        </div>
      </div>
    )
  }

  const viewer_wrap_style = S(
    'absolute h-100p bg-fff t-0 l-0 z-1000 ml-0 w-100p'
  )

  let left_area = (
    <div style={S('h-65 w-200')}>
      <a
        href={
          Brand.asset('site_logo_wide') ? `http://${window.location.host}` : '/'
        }
        style={{
          ...S('font-28 pt-15 pl-15'),
          display: 'block',
          lineHeight: 1,
          textDecoration: 'none'
        }}
        className="tk-calluna-sans text-primary"
      >
        {Brand.asset('site_logo_wide') ? (
          <img
            alt="brand"
            style={S('w-100p')}
            src={Brand.asset('site_logo_wide')}
          />
        ) : (
          <img
            alt="Rechat"
            width={36}
            height={36}
            src="/static/images/logo.svg"
          />
        )}
      </a>
    </div>
  )

  let brand_agent_footer

  if (brand_agent) {
    let profile_image_area

    if (brand_agent.cover_image_url) {
      profile_image_area = (
        <div
          style={S(
            `w-300 h-300 center-block br-300 bg-cover bg-top bg-url(${
              brand_agent.cover_image_url
            })`
          )}
        />
      )
    }

    let phone_area

    if (brand_agent.phone_number) {
      phone_area = (
        <div style={S('font-15 mb-5')}>
          M: {formatPhoneNumber(brand_agent.phone_number)}
        </div>
      )
    }

    brand_agent_area = (
      <div style={S('color-fff w-100p text-left center-block text-center')}>
        {profile_image_area}
        <div style={S('p-20 w-100p')}>
          <div style={S('font-18 mb-5 color-fff')}>
            <span style={S('fw-400')}>
              {brand_agent.first_name} {brand_agent.last_name}
            </span>
          </div>
          <div style={S('font-14 mb-15 relative')}>
            <div
              style={S(
                `bg-cover bg-url(${Brand.asset(
                  'office_logo'
                )}) bg-center w-20 h-20 inline-block mr-10 mt-10`
              )}
            />
            <div style={S('inline-block relative t-5n')}>
              {Brand.message('office_title')}
            </div>
            <div className="clearfix" />
          </div>
          {phone_area}
          <div style={S('font-15 mb-5')}>E: {brand_agent.email}</div>
        </div>
        <div style={S('font-22 color-fff')} className="lato">
          Love this home? I can help you.
        </div>
      </div>
    )
    brand_agent_footer = (
      <div style={S('w-100p pt-20 pb-20 bg-263445 text-center')}>
        {brand_agent_area}
      </div>
    )
  }

  return (
    <div style={viewer_wrap_style}>
      {left_area}
      {main_content}
      {brand_agent_footer}
      <ClaimAccountBanner />
    </div>
  )
}

export default ListingMobileView
