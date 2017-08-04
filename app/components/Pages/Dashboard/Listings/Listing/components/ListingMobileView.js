import S from 'shorti'
import ReactDOM from 'react-dom'
import Map from 'google-map-react'
import ReactSwipe from 'react-swipe'
import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import { Col, Button } from 'react-bootstrap'

// import { connect } from 'react-redux'
// import compose from 'recompose/compose'
// import lifecycle from 'recompose/lifecycle'
// import withState from 'recompose/withState'
// import withHandlers from 'recompose/withHandlers'

import helpers from '../../../../../../utils/helpers'
import config from '../../../../../../../config/public'
import Brand from '../../../../../../controllers/Brand'
import listing_util from '../../../../../../utils/listing'

import Loading from '../../../../../Partials/Loading'
import FavoriteHeart from '../../components/FavoriteHeart'
import ListingMarker from '../../../Partials/ListingMarker'
import ListingMapMarker from '../../../Partials/ListingMapMarker'

// import { fadeIn } from './ListingDesktopView'
// import { handleActivateAccountClick } from './ListingDesktopView'

// import ShareModal from '../../components/modals/ShareListingModal'

const ListingMobileView = ({
  data,
  listing,
  isFetching,
  // showShareModal,
  // onHideShareModal,
  // shareModalIsActive
}) => {
  const { user } = data
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

  if (listing && listing.property) {
    property = listing.property
    price = listing.price

    if (listing.close_price && user && user.user_type === 'Agent') {
      price = listing.close_price
    }

    price = helpers.numberWithCommas(price)
    year_built = property.year_built
    address = listing_util.addressTitle(property.address)
    listing_title = address
    mls_number = listing.mls_number
    bedroom_count = property.bedroom_count
    bathroom_count = property.bathroom_count
    square_feet = helpers.numberWithCommas(
      Math.floor(listing_util.metersToFeet(property.square_meters))
    )

    if (property.square_meters) {
      price_sq_foot = (Number(price.replace(/,/g, '')) /
        Number(square_feet.replace(/,/g, ''))).toFixed(2)
    }

    if (property.lot_size_area) {
      lot_size = property.lot_size_area
    }

    description = property.description

    const { gallery_image_urls } = listing
    listing_images = (
      <ReactSwipe className="carousel" swipeOptions={{ continuous: false }}>
        {gallery_image_urls.map((gallery_image_url, i) =>
          <div key={`gallery-image-${gallery_image_url}${i}`}>
            <div
              style={S(
                `w-100p h-300 pull-left text-center bg-efefef bg-cover bg-center bg-url(${listing_util.getResizeUrl(
                  gallery_image_url
                )}?w=500)`
              )}
            />
          </div>
        )}
      </ReactSwipe>
    )

    // Cache images for uninteruted scroll
    const listing_images_cached = gallery_image_urls.map((image_url, i) =>
      <img
        key={`image-${i}`}
        src={`${listing_util.getResizeUrl(image_url)}?w=500`}
        style={S('w-0 h-0')}
      />
    )

    listing_subtitle = `${listing.property.address.city}, ${listing.property
      .address.state} ${listing.property.address.postal_code}`

    const status_color = listing_util.getStatusColor(listing.status)

    let sold_date
    if (listing.close_date) {
      const sold_date_obj = helpers.friendlyDate(listing.close_date)
      sold_date = `${sold_date_obj.month} ${sold_date_obj.date}, ${sold_date_obj.year}`
    }

    const listing_status_indicator = (
      <div
        className="pull-left"
        style={S('bg-ebeef1 relative t-7 br-100 pt-11 h-35 pl-36 pr-15 mr-15')}
      >
        <span
          style={S(`mr-5 font-46 l-10 t-17n absolute color-${status_color}`)}
        >
          &#8226;
        </span>
        <span style={S('font-14 relative t-3n')}>
          <b>
            {listing.status} {sold_date}
          </b>
        </span>
      </div>
    )

    let number_days_indicator
    if (listing.list_date) {
      const days_on_market = listing_util.getDOM(listing.dom)
      number_days_indicator = (
        <div
          className="pull-left"
          style={S(
            'bg-ebeef1 relative t-7 br-100 pt-11 h-35 pl-15 pr-15 mr-15'
          )}
        >
          <span style={S('font-14 relative t-3n')}>
            <b>
              {days_on_market} days ago
            </b>
          </span>
        </div>
      )
    }

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
          <img style={S('w-100p')} src={brand_agent.cover_image_url} />
        )
      }

      let phone_area
      if (brand_agent.phone_number) {
        phone_area = (
          <div style={S('font-15 mb-5')}>
            M: {brand_agent.phone_number}
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
              <div style={S('pull-left')}>
                {Brand.message('office_title')}
              </div>
              <div className="clearfix" />
            </div>
            {phone_area}
            <div style={S('font-15 mb-5')}>
              E: {brand_agent.email}
            </div>
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
          <div style={S('font-15 mb-5')}>
            {showing_instructions}
          </div>
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
          <div style={S('font-15 mb-5')}>
            {listing.list_office_name}
          </div>
          {showing_instructions}
          <div style={email_style}>
            <a
              href={`mailto:${listing.list_agent_email}?subject=Your listing on Rechat.com&body=I saw your listing (${listing_title}) on Rechat.com and I'm interested in getting more information.`}
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
          <Col xs={12}>
            <div style={S('fw-600 font-18 mb-10')}>
              Location
              <div className="clearfix" />
            </div>
          </Col>
          <div style={S('relative w-100p pull-left')}>
            <Map
              zoom={12}
              key={'map'}
              style={S('w-100p h-300')}
              bootstrapURLKeys={bootstrap_url_keys}
              center={{ lat: latitude, lng: longitude }}
              options={{ scrollwheel: false, draggable: false }}
            >
              <ListingMapMarker
                lat={latitude}
                lng={longitude}
                style={S('pointer mt-10')}
              >
                <ListingMarker
                  data={data}
                  listing={listing}
                  property={listing.property}
                  address={listing.property.address}
                  key={`listing-marker${listing.id}`}
                />
              </ListingMapMarker>
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
          <Col xs={12}>
            <div style={S('fw-700 font-30')}>
              ${price}
              {listing.property &&
              listing.property.property_type === 'Residential Lease'
                ? '/mo'
                : ''}{' '}
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
                {number_days_indicator}
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
          </Col>
          <Col xs={12} style={S('mb-15')}>
            {brand_agent_area}
            {list_agent_area}
          </Col>
          <div className="clearfix" />
          <div style={S('mb-20')}>
            {location_area}
            <div className="clearfix" />
          </div>
          <div>
            <Col xs={12}>
              <div style={S('fw-600 font-18 mb-10')}>Description</div>
              <div style={S('color-4a4a4a font-18 mb-20 pr-30')}>
                {description}
              </div>
            </Col>
            <div className="clearfix" />
          </div>
          <Col xs={12}>
            <div style={S('mb-15 font-15')}>
              <div style={S('pr-20')}>
                <div style={S('mb-20')}>
                  <div style={S('fw-600 font-18 mb-10')}>Cost Breakdown</div>
                  <div style={S('color-aaaaaa mb-10')}>
                    Price/sqt:{' '}
                    <span style={S('color-777')}>${price_sq_foot}</span>
                  </div>
                  <div style={S('color-aaaaaa mb-10')}>
                    Unexempt Taxes:{' '}
                    <span style={S('color-777')}>
                      ${listing.unexempt_taxes
                        ? helpers.numberWithCommas(listing.unexempt_taxes)
                        : 0}
                    </span>
                  </div>
                  <div style={S('color-aaaaaa mb-10')}>
                    HOA Fees:{' '}
                    <span style={S('color-777')}>
                      ${listing.association_fee ? listing.association_fee : 0}
                    </span>
                  </div>
                  <div style={S('color-aaaaaa mb-10')}>
                    HOA Frequency:{' '}
                    <span style={S('color-777')}>
                      {listing.association_fee_frequency}
                    </span>
                  </div>
                  <div style={S('color-aaaaaa mb-10')}>
                    HOA Includes:{' '}
                    <span style={S('color-777')}>
                      {listing.association_fee_includes}
                    </span>
                  </div>
                </div>
              </div>
              <div style={S('pr-20 mb-20')}>
                <div style={S('fw-600 mb-10 font-18')}>Key Facts</div>
                <div style={S('color-aaaaaa mb-10')}>
                  Year Built:{' '}
                  <span style={S('color-777')}>{property.year_built}</span>
                </div>
                <div style={S('color-aaaaaa mb-10')}>
                  Style of House:{' '}
                  <span style={S('color-777')}>
                    {property.architectural_style}
                  </span>
                </div>
                <div style={S('color-aaaaaa mb-10')}>
                  Subdivision:{' '}
                  <span style={S('color-777')}>
                    {property.subdivision_name}
                  </span>
                </div>
                <div style={S('color-aaaaaa mb-10')}>
                  Acres:{' '}
                  <span style={S('color-777')}>{property.lot_size_area}</span>
                </div>
                <div style={S('color-aaaaaa mb-10')}>
                  Stories:{' '}
                  <span style={S('color-777')}>
                    {property.number_of_stories}
                  </span>
                </div>
                <div style={S('color-aaaaaa mb-10')}>
                  MLS#: <span style={S('color-777')}>{listing.mls_number}</span>
                </div>
                <div style={S('color-aaaaaa mb-10')}>
                  Possession:{' '}
                  <span style={S('color-777')}>{listing.possession}</span>
                </div>
                <div style={S('color-aaaaaa mb-10')}>
                  Days On Market:{' '}
                  <span style={S('color-777')}>
                    {listing_util.getDOM(listing.dom)}
                  </span>
                </div>
                <div style={S('color-aaaaaa')}>
                  Current Days On Market:{' '}
                  <span style={S('color-777')}>
                    {listing_util.getDOM(listing.cdom)}
                  </span>
                </div>
              </div>
              <div style={S('pr-20')}>
                <div style={S('fw-600 font-18 mb-10')}>
                  Amenities & Utilities
                </div>
                <div style={S('color-aaaaaa mb-10')}>
                  Pool:{' '}
                  <span style={S('color-777')}>
                    {property.pool_yn ? 'Yes' : 'No'}
                  </span>
                </div>
                <div style={S('color-aaaaaa mb-10')}>
                  Pool Features:&nbsp;
                  <span style={S('color-777')}>
                    {property.pool_features.map(item =>
                      <span key={item}>
                        {item},{' '}
                      </span>
                    )}
                  </span>
                </div>
                <div style={S('color-aaaaaa mb-10')}>
                  Handicap Amenities:{' '}
                  <span style={S('color-777')}>
                    {property.handicap_yn ? 'Yes' : 'No'}
                  </span>
                </div>
                <div style={S('color-aaaaaa mb-10')}>
                  Heating/Cooling:&nbsp;
                  <span style={S('color-777')}>
                    {property.heating.map(item =>
                      <span key={item}>
                        {item},{' '}
                      </span>
                    )}
                  </span>
                </div>
                <div style={S('color-aaaaaa mb-10')}>
                  Other:&nbsp;
                  <span style={S('color-777')}>
                    {property.utilities.map(item =>
                      <span key={item}>
                        {item},{' '}
                      </span>
                    )}
                  </span>
                </div>
              </div>
              <div className="clearfix" />
            </div>
            <div className="clearfix" />
            <div style={S('font-15')}>
              <div style={S('pr-20')}>
                <div style={S('fw-600 font-18 mb-10')}>All Features</div>
                <div style={S('color-aaaaaa mb-10')}>
                  Garage Spaces:&nbsp;
                  <span style={S('color-777')}>
                    {property.parking_spaces_garage}
                  </span>
                </div>
                <div style={S('color-aaaaaa mb-10')}>
                  Parking/Garage:&nbsp;
                  <span style={S('color-777')}>
                    {property.parking_spaces_garage ? 'Yes' : 'No'}
                  </span>
                </div>
                <div style={S('color-aaaaaa mb-10')}>
                  Interior Features:&nbsp;
                  <span style={S('color-777')}>
                    {property.interior_features.map(item =>
                      <span key={item}>
                        {item},{' '}
                      </span>
                    )}
                  </span>
                </div>
                <div style={S('color-aaaaaa mb-10')}>
                  Alarm/Security:&nbsp;
                  <span style={S('color-777')}>
                    {property.security_features.map(item =>
                      <span key={item}>
                        {item},{' '}
                      </span>
                    )}
                  </span>
                </div>
                <div style={S('color-aaaaaa mb-10')}>
                  Flooring:&nbsp;
                  <span style={S('color-777')}>
                    {property.flooring.map(item =>
                      <span key={item}>
                        {item},{' '}
                      </span>
                    )}
                  </span>
                </div>
              </div>
              <div style={S('pr-20 mb-20')}>
                <div style={S('color-aaaaaa mb-10')}>
                  Exterior Features:&nbsp;
                  <span style={S('color-777')}>
                    {property.exterior_features.map(item =>
                      <span key={item}>
                        {item},{' '}
                      </span>
                    )}
                  </span>
                </div>
                <div style={S('color-aaaaaa mb-10')}>
                  Construction:&nbsp;
                  <span style={S('color-777')}>
                    {property.construction_materials}
                  </span>
                </div>
                <div style={S('color-aaaaaa mb-10')}>
                  Foundation:&nbsp;
                  <span style={S('color-777')}>
                    {property.foundation_details}
                  </span>
                </div>
                <div style={S('color-aaaaaa mb-10')}>
                  Roof:&nbsp;
                  <span style={S('color-777')}>{property.roof}</span>
                </div>
              </div>
              <div style={S('pr-20 mb-20')}>
                <div style={S('fw-600 font-18 mb-10')}>Schools</div>
                <div style={S('color-aaaaaa mb-10')}>
                  School District:{' '}
                  <span style={S('color-777')}>{property.school_district}</span>
                </div>
                <div style={S('color-aaaaaa mb-10')}>
                  Elementary School:{' '}
                  <span style={S('color-777')}>
                    {property.elementary_school_name}
                  </span>
                </div>
                <div style={S('color-aaaaaa mb-10')}>
                  Middle School:{' '}
                  <span style={S('color-777')}>
                    {property.middle_school_name}
                  </span>
                </div>
                <div style={S('color-aaaaaa mb-10')}>
                  High School:{' '}
                  <span style={S('color-777')}>
                    {property.high_school_name}
                  </span>
                </div>
              </div>
              <div className="clearfix" />
            </div>
          </Col>
          <div className="clearfix" />
        </div>
      </div>
    )
  }

  const viewer_wrap_style = S(
    'absolute h-100p bg-fff t-0 l-0 z-1000 ml-0 w-100p'
  )
  const nav_bar_style = S('mb-0 p-0 h-65 pt-7 w-100p')

  // let join_area
  // let brand_logo = (
  //   <span style={S('font-28')} className="tk-calluna-sans text-primary">
  //     Rechat
  //   </span>
  // )
  // if (Brand.asset('site_logo_wide')) {
  //   const host = `https://${window.location.host}`
  //   brand_logo = (
  //     <span>
  //       <img style={S('w-200')} src={Brand.asset('site_logo_wide')} />
  //     </span>
  //   )
  // }

  // let left_area
  // if (user) {
  let left_area = (
    <div style={S('h-65 w-200')}>
      <a
        href={Brand.asset('site_logo_wide') ? `http://${window.location.host}` : '/'}
        style={{
          ...S('font-28 pt-15 pl-15'),
          display: 'block',
          lineHeight: 1,
          textDecoration: 'none'
        }}
        className="tk-calluna-sans text-primary"
      >
        {Brand.asset('site_logo_wide')
          ? <img style={S('w-100p')} src={Brand.asset('site_logo_wide')} />
          : 'Rechat'}
      </a>
    </div>
  )
  // left_area = (
  //   <button
  //     onClick={() => hideModal()}
  //     style={{
  //       position: 'absolute',
  //       left: '20px',
  //       top: '20px',
  //       fontSize: '18px',
  //       borderWidth: 0,
  //       padding: 0,
  //       backgroundColor: 'transparent'
  //     }}
  //   >
  //     <span
  //       href="#"
  //       style={S('relative pull-left font-30 mr-10 t-5n')}
  //       className="close"
  //     >
  //       &times;
  //     </span>
  //     Close
  //   </button>
  // )
  // }

  // let right_area
  // if (user && Object.keys(listing).length > 0) {
  //   const login_btn_color = Brand.color('primary', '006aff')

  //   right_area = (
  //     <div style={{ ...nav_bar_style, ...S('pull-right w-60p') }}>
  //       <div style={S('pull-right relative r-120 t-6')}>
  //         <FavoriteHeart listing={listing} width="40px" height="40px" />
  //       </div>
  //       <Button
  //         onClick={showShareModal}
  //         style={S(
  //           `absolute r-20 t-15 bg-${login_btn_color} border-1-solid-${login_btn_color}`
  //         )}
  //         bsStyle="primary"
  //         type="button"
  //       >
  //         Share &nbsp;&nbsp;<i className="fa fa-share" />
  //       </Button>
  //     </div>
  //   )
  // }

  // if (!user) {
  //   const login_btn_color = Brand.color('primary', '006aff')

  //   join_area = (
  //     <div style={S('h-70')}>
  //       <div style={S('pull-left p-16')}>
  //         {brand_logo}
  //       </div>
  //       <div style={S('pull-right pt-16')}>
  //         <a
  //           style={S(
  //             `color-fff mr-15 bg-${login_btn_color} border-1-solid-${login_btn_color}`
  //           )}
  //           className="btn"
  //           href={`/signin?redirect_to=/dashboard/mls/${listing.id}`}
  //         >
  //           Log in
  //         </a>
  //       </div>
  //     </div>
  //   )
  // }

  let brand_agent_footer
  if (brand_agent) {
    let profile_image_area
    if (brand_agent.cover_image_url) {
      profile_image_area = (
        <div
          style={S(
            `w-300 h-300 center-block br-300 bg-cover bg-top bg-url(${brand_agent.cover_image_url})`
          )}
        />
      )
    }

    let phone_area
    if (brand_agent.phone_number) {
      phone_area = (
        <div style={S('font-15 mb-5')}>
          M: {brand_agent.phone_number}
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
          <div style={S('font-15 mb-5')}>
            E: {brand_agent.email}
          </div>
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

  // Claim account message
  // let claim_account_message
  // let token
  // if (data.location && data.location.query && data.location.query.token) {
  //   token = data.location.query.token
  // }

  // if (token) {
  //   let contact_info = data.location.query.email

  //   if (data.location.query.phone_number) {
  //     contact_info = data.location.query.phone_number
  //   }

  //   claim_account_message = (
  //     <div style={S('bg-2196f3 color-fff w-100p font-17 p-20 text-center')}>
  //       This listing was shared to {contact_info}. Claim your account to save
  //       this listing and check out many more.&nbsp;&nbsp;&nbsp;&nbsp;
  //       <Button
  //         bsSize="large"
  //         style={S('bg-fff color-2196f3 border-none')}
  //         onClick={handleActivateAccountClick}
  //       >
  //         Activate your account
  //       </Button>
  //     </div>
  //   )
  // }

  // {claim_account_message}
  // {user && <div style={{ height: '65px' }} className="clearfix">
  //   {left_area}
  //   {right_area}
  // </div>}

  return (
    <div style={viewer_wrap_style}>
      {left_area}
      {main_content}
      {brand_agent_footer}
      {/*<ShareModal
        listing={listing}
        user={user}
        isActive={shareModalIsActive}
        onHide={onHideShareModal}
      />*/}
    </div>
  )
}

// export default compose(
//   withState('shareModalIsActive', 'setShareModalIsActive', false),
//   withHandlers({
//     hideModal: () => () => browserHistory.goBack()
//   }),
//   withHandlers({
//     onHideShareModal: ({ setShareModalIsActive }) => () => {
//       setShareModalIsActive(false)
//     },
//     showShareModal: ({ setShareModalIsActive }) => () => {
//       setShareModalIsActive(true)
//     }
//   }),
//   lifecycle({
//     componentDidMount() {
//       fadeIn(this)
//     }
//   })
// )(ListingMobileView)

export default ListingMobileView