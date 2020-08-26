import _ from 'lodash'
import S from 'shorti'
import Map from 'google-map-react'
import React from 'react'
import { browserHistory } from 'react-router'
import Flex from 'styled-flex-component'
import styled from 'styled-components'
import compose from 'recompose/compose'
import lifecycle from 'recompose/lifecycle'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import {
  Col,
  Modal,
  Tooltip,
  Carousel,
  CarouselItem,
  OverlayTrigger
} from 'react-bootstrap'
import { mdiClose, mdiArrowLeft, mdiArrowRight } from '@mdi/js'

import { formatPhoneNumber } from '../../../../../../utils/format'
import { friendlyDate, numberWithCommas } from '../../../../../../utils/helpers'
import config from '../../../../../../../config/public'
import Brand from '../../../../../../controllers/Brand'
import listingUtils from '../../../../../../utils/listing'
import ActionButton from '../../../../../../views/components/Button/ActionButton'
import TextIconButton from '../../../../../../views/components/Button/TextIconButton'
import LinkButton from '../../../../../../views/components/Button/LinkButton'
import { SvgIcon } from '../../../../../../views/components/SvgIcons/SvgIcon'

import FetchError from './FetchError'
import MLSNote from './MLSNote'
import ClaimAccountBanner from './ClaimAccountBanner'
import Loading from '../../../../../Partials/Loading'
import FavoriteHeart from '../../components/FavoriteHeart'
import ListingMarker from '../../components/ListingMarker'

import ShareModal from '../../components/modals/ShareListingModal'

import { appSidenavWidth } from '../../../SideNav/variables'

export const renderFeatures = (title, value) => {
  if (!value) {
    return null
  }

  if (Array.isArray(value)) {
    value = value.length > 0 ? value.join(', ') : 'unknown'
  } else if (typeof value === 'boolean') {
    value = value ? 'Yes' : 'No'
  }

  return (
    <div style={{ color: '#aaaaaa', marginBottom: '1rem' }}>
      {`${title}: `}
      <span style={{ color: '#777' }}>{value}</span>
    </div>
  )
}

import { primary } from '../../../../../../views/utils/colors'

const ArrowContainer = styled(Flex)`
  width: 48px;
  height: 48px;
  box-shadow: 0 0 28px 0 rgba(0, 0, 0, 0.15), 0 0 10px 0 rgba(0, 0, 0, 0.16);
  background-color: #000000;
  border-radius: 50%;
  margin-left: ${({ left }) => (left ? '1.5rem' : 'auto')};
  margin-right: ${({ left }) => (left ? 'auto' : '1.5rem')};
`

const ListingDesktopView = ({
  data,
  user,
  brand,
  onHide,
  listing,
  hideModal,
  container,
  isFetching,
  errorMessage,
  showShareModal,
  onHideShareModal,
  showModalGallery,
  shareModalIsActive,
  setGalleryModalState,
  galleryModalIsActive,
  handleModalGalleryNav,
  galleryModalActiveIndex,
  galleryModalDirection,
  windowInnerWidth
}) => {
  const brandColor = Brand.color('primary', primary, brand)

  const brand_agent = listing.proposed_agent

  let viewer_width = 0

  if (typeof window !== 'undefined') {
    viewer_width = windowInnerWidth

    if (!data.is_widget && container !== 'modal') {
      viewer_width -= appSidenavWidth + 15 // Scrollbar width
    }
  }

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
  let prev_icon = (
    <ArrowContainer center left>
      <SvgIcon path={mdiArrowLeft} />
    </ArrowContainer>
  )
  let next_icon = (
    <ArrowContainer center>
      <SvgIcon path={mdiArrowRight} />
    </ArrowContainer>
  )
  let listing_subtitle
  let brand_agent_area
  let bathroomBaloonText

  if (container === 'modal') {
    hideModal = onHide
  }

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
    <FetchError message={errorMessage} backButtonHandler={hideModal} />
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
    bathroom_count = property.bathroom_count || '-'
    bathroomBaloonText =
      property.full_bathroom_count != null
        ? `${property.full_bathroom_count} Full Bath`
        : ''
    bathroomBaloonText +=
      property.half_bathroom_count != null
        ? ` + ${property.half_bathroom_count} Half Bath`
        : ''
    bathroomBaloonText = bathroomBaloonText || 'Unknown'
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
    const gallery_chunks = _.chunk(gallery_image_urls, 4)

    const carouselItemDivStyle =
      'border-right-1-solid-fff w-25p h-300 pull-left text-center bg-efefef bg-cover bg-center'

    listing_images = (
      <Carousel
        interval={0}
        indicators={false}
        slide={false}
        prevIcon={gallery_chunks.length > 1 && prev_icon}
        nextIcon={gallery_chunks.length > 1 && next_icon}
        className="listing-viewer__carousel"
      >
        {gallery_chunks.map((gallery_image_url, i) => (
          <CarouselItem
            className="listing-carousel__item"
            key={`gallery-images-chunked-${gallery_image_url[0]}${i}`}
          >
            <div
              onClick={() => showModalGallery(gallery_image_url[0])}
              style={S(
                `${carouselItemDivStyle} bg-url(${gallery_image_url[0]})`
              )}
            />
            <div
              onClick={() => showModalGallery(gallery_image_url[1])}
              style={S(
                `${carouselItemDivStyle} bg-url(${gallery_image_url[1]})`
              )}
            />
            <div
              onClick={() => showModalGallery(gallery_image_url[2])}
              style={S(
                `${carouselItemDivStyle} bg-url(${gallery_image_url[2]})`
              )}
            />
            <div
              onClick={() => showModalGallery(gallery_image_url[3])}
              style={S(
                `${carouselItemDivStyle} bg-url(${gallery_image_url[3]})`
              )}
            />
          </CarouselItem>
        ))}
      </Carousel>
    )

    // Cache images for uninteruted 3-pic and single scroll
    const listing_images_cached = gallery_image_urls.map((image_url, i) => (
      <div key={`cached-images-${i}`} style={S('w-0 h-0')}>
        <img
          alt="gallery"
          key={`image-800-${i}`}
          src={`${image_url}?w=800`}
          style={S('w-0 h-0')}
        />
        <img
          alt="gallery"
          key={`image-1200-${i}`}
          src={`${image_url}?w=1200`}
          style={S('w-0 h-0')}
        />
      </div>
    ))

    listing_subtitle = `${listing.property.address.city}, ${listing.property.address.state} ${listing.property.address.postal_code}`

    const status_color = listingUtils.getStatusColor(listing.status)

    let sold_date

    if (listing.close_date) {
      const sold_date_obj = friendlyDate(listing.close_date)

      sold_date = `${sold_date_obj.month} ${sold_date_obj.date}, ${sold_date_obj.year}`
    }

    const listing_status_indicator = (
      <div
        className="pull-left"
        style={S(
          `relative
          font-14
          br-3 pt-5 pb-5 pl-10 pr-10 mt-3
          border-1-solid-${status_color}
          bg-${status_color} color-fff`
        )}
      >
        {listing.status} {sold_date}
      </div>
    )

    // let number_days_indicator
    // if (listing.list_date) {
    //   const days_on_market = listingUtils.getDOM(listing.dom)
    //   number_days_indicator = (
    //     <div
    //       className="pull-left"
    //       style={S(
    //         'border-1-solid-263445 br-3 pt-5 pb-5 pl-10 pr-10 mt-3 font-14'
    //       )}
    //     >
    //       {days_on_market} days ago
    //     </div>
    //   )
    // }

    const tooltip = <Tooltip id="copied-tooltip">Copied</Tooltip>

    let mls_link

    if (mls_number) {
      mls_link = (
        <span>
          | MLS#:&nbsp;
          <OverlayTrigger
            rootClose
            trigger="click"
            placement="bottom"
            overlay={tooltip}
          >
            <span
              style={S('color-8ba8d1 pointer')}
              className="copy-mls"
              data-clipboard-text={mls_number}
            >
              {mls_number}
            </span>
          </OverlayTrigger>
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
              style={{ maxWidth: '300px' }}
              src={brand_agent.cover_image_url}
            />
          </div>
        )
      }

      let phone_area

      if (brand_agent.phone_number) {
        phone_area = (
          <div style={S('mb-5')}>
            M: {formatPhoneNumber(brand_agent.phone_number)}
          </div>
        )
      }

      brand_agent_area = (
        <div style={S('color-bfc3c7 text-left relative')}>
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
            <div style={S('mb-5')}>E: {brand_agent.email}</div>
          </div>
        </div>
      )
    }

    let list_agent_area

    if (user && user.user_type === 'Agent') {
      const email_style = {
        ...S('mb-20'),
        wordWrap: 'break-word'
      }

      // TODO New Listing Info
      let showing_instructions

      if (listing.showing_instructions) {
        showing_instructions = (
          <div style={S('mb-5')}>{showing_instructions}</div>
        )
      }

      list_agent_area = (
        <div
          style={S(
            'mt-20 color-748090 w-100p border-1-solid-ededed br-3 p-20 text-center'
          )}
        >
          <div
            style={{ fontSize: '18px', marginBottom: '5px', color: primary }}
          >
            <span style={S('fw-400')}>
              {listing.list_agent_full_name}, Seller Agent
            </span>
          </div>
          <div style={S('mb-5')}>{listing.list_agent_direct_work_phone}</div>
          <div style={S('mb-5')}>{listing.list_office_name}</div>
          {showing_instructions}
          <div style={email_style}>
            <a
              href={`mailto:${listing.list_agent_email}
              ?subject=Your listing on Rechat.com&body=
              I saw your listing (${listing_title}) on Rechat.com and
              I'm interested in getting more information.`}
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

    let listing_map_small

    if (listing.property.address.location) {
      const center = {
        lat: listing.property.address.location.latitude,
        lng: listing.property.address.location.longitude
      }

      const bootstrap_url_keys = {
        key: config.google.api_key,
        libraries: ['drawing', 'places'].join(',')
      }

      listing_map_small = (
        <Map
          zoom={12}
          key="map"
          center={center}
          options={{
            zoomControl: true,
            scrollwheel: false,
            disableDefaultUI: true
          }}
          bootstrapURLKeys={bootstrap_url_keys}
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
      )
    }

    let asking_price_area

    if (listing.close_price && user && user.user_type === 'Client') {
      asking_price_area = (
        <span style={S('font-28 relative t-5n color-ccc fw-400')}>
          (Asking price)
        </span>
      )
    }

    let agent_area_client = (
      <div>
        <div style={S('fw-600 font-18 mb-10')}>Listing Provided by</div>
        <div>
          <span style={S('fw-400')}>
            {listing.list_agent_full_name}, {listing.list_office_name}
          </span>
        </div>
      </div>
    )

    main_content = (
      <div style={S('bg-fff')}>
        <div style={{ margin: '0 1.5rem', position: 'relative', padding: 0 }}>
          {listing.gallery_image_urls && listing.gallery_image_urls.length
            ? listing_images
            : ''}
          {listing.gallery_image_urls && listing.gallery_image_urls.length
            ? listing_images_cached
            : ''}
          <div className="clearfix" />
        </div>

        <div>
          <div style={{ padding: '2rem 1.5rem' }} className="clearfix">
            <Col sm={9} style={S('pl-0')}>
              <div style={S('mb-20')}>
                <Col sm={4} style={S('pl-0')}>
                  <div style={S('w-100p br-3 border-1-solid-f4f6f9')}>
                    <div style={S('h-200')}>{listing_map_small}</div>
                    <div style={S('w-100p bg-fff p-5 font-13')}>
                      <div style={S('text-center w-50p pull-left')}>
                        <a
                          target="_blank"
                          href={`http://maps.google.com/?q=${listing.property.address.geo_source_formatted_address_google}`}
                        >
                          Google Maps
                        </a>
                        <div style={S('bg-ebebeb w-1 h-16 pull-right')} />
                      </div>
                      <div style={S('text-center w-50p pull-left')}>
                        <a
                          target="_blank"
                          href={`http://maps.google.com/?q=${listing.property.address.geo_source_formatted_address_google}&layer=c&cbll=${listing.property.address.location.latitude},${listing.property.address.location.longitude}`}
                        >
                          Street View
                        </a>
                      </div>
                      <div className="clearfix" />
                    </div>
                  </div>
                </Col>
                <Col sm={8} style={S('p-0 pull-right')}>
                  <div style={S('fw-700 font-60')}>
                    ${price}
                    {listingUtils.isLeaseProperty(listing) ? '/mo' : ''}{' '}
                    {asking_price_area}
                  </div>
                  <div className="lato" style={S('font-24 color-8696a4 mb-10')}>
                    {listing_title}
                  </div>
                  <div style={S('mb-20')}>
                    <div style={S('pull-left mb-10 mr-10')}>
                      {listing_status_indicator}
                    </div>
                  </div>
                  <div className="clearfix" />
                  <div style={S('font-18 color-b7bfc7 mb-10')}>
                    {listing_subtitle} {mls_link}
                  </div>
                  <div style={S('color-4a4a4a mb-10')}>
                    <span>{bedroom_count} Beds</span>
                    &nbsp;&nbsp;&nbsp;&middot;&nbsp;&nbsp;&nbsp;
                    <span
                      data-balloon-pos="down"
                      data-balloon={bathroomBaloonText}
                    >
                      {bathroom_count} Baths
                    </span>
                    &nbsp;&nbsp;&nbsp;&middot;&nbsp;&nbsp;&nbsp;
                    <span>{square_feet} Sqft</span>
                    &nbsp;&nbsp;&nbsp;&middot;&nbsp;&nbsp;&nbsp;
                    <span>{year_built ? `Built in ${year_built}` : ''}</span>
                    {lot_size_area}
                  </div>
                </Col>
                <div className="clearfix" />
              </div>
              <div style={S('mb-70')}>{description}</div>
              <div
                style={{
                  width: '100%',
                  marginBottom: '2rem',
                  display: 'inline-flex'
                }}
              >
                <div
                  style={{ width: 'calc(33% - 1rem)', marginRight: '1.5rem' }}
                >
                  <div style={S('mb-30')}>
                    <div style={S('fw-600 mb-10 font-18')}>Cost Breakdown</div>
                    {renderFeatures('Price/sqt', `$${price_sq_foot}`)}
                    {renderFeatures(
                      'Unexempt Taxes',
                      listing.unexempt_taxes
                        ? `$${listing.unexempt_taxes}`
                        : '0'
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
                <div
                  style={{ width: 'calc(33% - 1rem)', marginRight: '1.5rem' }}
                >
                  <div style={S('fw-600 mb-10 font-18')}>Key Facts</div>
                  {renderFeatures('Year Built', property.year_built)}
                  {renderFeatures(
                    'Style of House',
                    property.architectural_style
                  )}
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
                <div style={{ width: 'calc(33% - 1rem)' }}>
                  <div style={S('fw-600 font-18 mb-10')}>
                    Amenities & Utilities
                  </div>
                  {renderFeatures('Pool', property.pool_yn)}
                  {renderFeatures('Pool Features', property.pool_features)}
                  {renderFeatures('Handicap Amenities', property.handicap_yn)}
                  {renderFeatures('Heating/Cooling', property.heating)}
                  {renderFeatures('Others', property.utilities)}
                </div>
              </div>
            </Col>
            <div style={S('p-0 pull-right')}>
              {brand_agent_area}
              {list_agent_area}
            </div>
          </div>
          <div className="clearfix" />
          <div style={{ padding: '2.5rem 1.5rem', backgroundColor: '#f8f8f8' }}>
            <Col sm={9} style={S('pl-0')}>
              <div style={{ display: 'inline-flex', marginBottom: '2rem' }}>
                <div
                  style={{ width: 'calc(33% - 1rem)', marginRight: '1.5rem' }}
                >
                  <div>
                    <div style={S('fw-600 font-18 mb-10')}>All Features</div>
                    {renderFeatures(
                      'Parking Spaces',
                      property.parking_spaces_covered_total
                    )}
                    {renderFeatures(
                      'Interior Features',
                      property.interior_features
                    )}
                    {renderFeatures(
                      'Alarm/Security',
                      property.security_features
                    )}
                    {renderFeatures('Flooring', property.flooring)}
                  </div>
                </div>
                <div
                  style={{ width: 'calc(33% - 1rem)', marginRight: '1.5rem' }}
                >
                  <div style={S('h-35')} />
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
                <div style={{ width: 'calc(33% - 1rem)' }}>
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
              </div>
              {agent_area_client}
              {listing && (
                <MLSNote mls={listing.mls} mlsName={listing.mls_name} />
              )}
            </Col>
            <div className="clearfix" />
          </div>
        </div>
      </div>
    )
  }

  let viewer_wrap_style = S(
    `absolute h-100p bg-fff t-0 l-0 z-10 ml-${appSidenavWidth} w-${viewer_width}`
  )

  if (data.is_widget) {
    viewer_wrap_style = {
      ...viewer_wrap_style,
      ...S('ml-0 w-100p')
    }
  }

  viewer_wrap_style = container !== 'modal' ? viewer_wrap_style : {}

  let modal_gallery_area

  if (galleryModalIsActive) {
    const gallery_image_urls = listing.gallery_image_urls

    const onSelectHandler = (selectedIndex, event) => {
      handleModalGalleryNav(selectedIndex, event.direction)
    }

    modal_gallery_area = (
      <Carousel
        direction={galleryModalDirection}
        interval={0}
        indicators={false}
        prevIcon={prev_icon}
        nextIcon={next_icon}
        onSelect={onSelectHandler}
        activeIndex={galleryModalActiveIndex}
      >
        {gallery_image_urls.map((gallery_image_url, i) => (
          <CarouselItem key={`gallery-image-${gallery_image_url[0]}${i}`}>
            <div
              style={S(
                `w-100p h-500 pull-left text-center bg-efefef bg-cover bg-center bg-url(${gallery_image_url})`
              )}
            />
          </CarouselItem>
        ))}
      </Carousel>
    )
  }

  let contact_info

  if (data.location && data.location.query && data.location.query.token) {
    contact_info = data.location.query.email

    if (data.location.query.phone_number) {
      contact_info = data.location.query.phone_number
    }
  }

  const headerProps = {
    alignCenter: true,
    justifyBetween: true,
    style: { padding: '2rem 1.5rem' }
  }
  const Header = (
    <Flex {...headerProps}>
      <TextIconButton
        appearance="outline"
        onClick={hideModal}
        iconLeft={() => <SvgIcon path={mdiClose} rightMargined />}
        text="Close"
      />
      {user ? (
        <Flex alignCenter>
          <div style={{ marginRight: '1em' }}>
            <FavoriteHeart listing={listing} width="40px" height="40px" />
          </div>
          <ActionButton onClick={showShareModal} brandColor={brandColor}>
            Share
          </ActionButton>
        </Flex>
      ) : (
        <LinkButton
          appearance="primary"
          to={`/signin?redirectTo=${encodeURIComponent(
            window.location.pathname
          )}
        ${contact_info ? `&username=${contact_info}` : ''}
        ${window.location.search}`}
        >
          Login
        </LinkButton>
      )}
    </Flex>
  )

  let brand_agent_footer

  if (brand_agent) {
    let profile_image_area

    if (brand_agent.cover_image_url) {
      profile_image_area = (
        <div
          style={S(
            `w-300 h-300
            center-block br-300
            bg-cover bg-top bg-url(${brand_agent.cover_image_url})`
          )}
        />
      )
    }

    let phone_area

    if (brand_agent.phone_number) {
      phone_area = (
        <div style={S('mb-5')}>
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
          <div style={S('mb-5')}>E: {brand_agent.email}</div>
        </div>
        <div style={S('font-32 color-fff')} className="lato">
          Love this home? I can help you.
        </div>
      </div>
    )
    brand_agent_footer = (
      <div
        style={{
          borderLeft: '1px solid #304054',
          ...S('w-100p pt-40 pb-40 bg-263445 text-center')
        }}
      >
        {brand_agent_area}
      </div>
    )
  }

  return (
    <div style={viewer_wrap_style}>
      {Header}
      {main_content}
      {brand_agent_footer}

      <Modal
        bsSize="large"
        onHide={() => setGalleryModalState(false)}
        show={galleryModalIsActive}
      >
        <div style={S('relative')}>
          <div
            className="close"
            onClick={() => setGalleryModalState(false)}
            style={S('absolute r-0 t-60n font-60 z-1000 fw-100')}
          >
            &times;
          </div>
        </div>
        {modal_gallery_area}
      </Modal>
      <ShareModal
        listing={listing}
        user={user}
        isActive={shareModalIsActive}
        onHide={onHideShareModal}
      />
      <ClaimAccountBanner />
    </div>
  )
}

export default compose(
  withState('shareModalIsActive', 'setShareModalIsActive', false),
  withState('galleryModalIsActive', 'setGalleryModalState', false),
  withState('galleryModalDirection', 'setGalleryModalDirection', ''),
  withState('galleryModalActiveIndex', 'setGalleryModalActiveIndex', 0),
  withState('galleryModalDirection', 'setGalleryModalDirection', 'next'),
  withHandlers({
    hideModal: () => () => {
      const currentLocation = browserHistory.getCurrentLocation()

      if (currentLocation.key) {
        browserHistory.goBack()
      } else {
        browserHistory.push('/dashboard/mls')
      }
    }
  }),
  withHandlers({
    onHideShareModal: ({ setShareModalIsActive }) => () => {
      setShareModalIsActive(false)
    },
    showShareModal: ({ setShareModalIsActive }) => () => {
      setShareModalIsActive(true)
    }
  }),
  withHandlers({
    showModalGallery: ({
      listing,
      setGalleryModalState,
      setGalleryModalActiveIndex
    }) => imageUrl => {
      if (!imageUrl) {
        return
      }

      const { gallery_image_urls } = listing
      const imageIndex = gallery_image_urls.indexOf(imageUrl)

      setGalleryModalState(true)
      setGalleryModalActiveIndex(imageIndex)
    }
  }),
  withHandlers({
    handleModalGalleryNav: ({
      listing,
      galleryModalActiveIndex,
      setGalleryModalActiveIndex,
      setGalleryModalDirection
    }) => (selectedIndex, selectedDirection) => {
      const { gallery_image_urls } = listing
      const gallerLength = gallery_image_urls.length - 1

      const currentIndex = galleryModalActiveIndex

      if (selectedDirection === 'prev' && currentIndex > 0) {
        setGalleryModalActiveIndex(currentIndex - 1)
      }

      if (selectedDirection === 'prev' && currentIndex === 0) {
        setGalleryModalActiveIndex(gallerLength)
      }

      if (selectedDirection === 'next' && currentIndex < gallerLength) {
        setGalleryModalActiveIndex(currentIndex + 1)
      }

      if (selectedDirection === 'next' && currentIndex === gallerLength) {
        setGalleryModalActiveIndex(0)
      }

      setGalleryModalDirection(selectedDirection)
    }
  }),
  withHandlers({
    windowKeyDownHandler: ({
      container,
      galleryModalIsActive,
      handleModalGalleryNav
    }) => event => {
      if (
        event.keyCode === 27 &&
        !galleryModalIsActive &&
        container !== 'modal'
      ) {
        browserHistory.goBack()
      }

      if (galleryModalIsActive) {
        if (event.keyCode === 37) {
          handleModalGalleryNav(null, 'prev')
        }

        if (event.keyCode === 39) {
          handleModalGalleryNav(null, 'next')
        }
      }
    }
  }),
  lifecycle({
    componentDidMount() {
      document.addEventListener(
        'keydown',
        this.props.windowKeyDownHandler,
        false
      )

      if (typeof window !== 'undefined') {
        const clipboard = require('clipboard')

        new clipboard('.copy-mls')
      }
    },
    componentWillUnmount() {
      document.removeEventListener('keydown', this.props.windowKeyDownHandler)
    }
  })
)(ListingDesktopView)
