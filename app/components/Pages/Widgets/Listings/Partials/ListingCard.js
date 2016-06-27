// Widgets/Partials/ListingCard.js
import React, { Component } from 'react'
import S from 'shorti'
import { OverlayTrigger, Input, Button, Popover } from 'react-bootstrap'
import listing_util from '../../../../../utils/listing'
import helpers from '../../../../../utils/helpers'
import FavoriteHeart from '../../../Dashboard/Partials/FavoriteHeart'
export default class ListingCard extends Component {
  render() {
    const listing = this.props.listing
    const data = this.props.data
    let property = listing.property
    if (!property)
      property = listing.compact_property
    let address = listing.address
    if (!address)
      address = property.address
    const square_feet = helpers.numberWithCommas(Math.floor(listing_util.metersToFeet(property.square_meters)))
    const listing_card_style = {
      ...S(`w-480 h-420 ml-20 mb-20 pull-left br-3 pointer relative`),
      boxShadow: '0 0 2px 0 rgba(0, 0, 0, 0.2)',
      overflow: 'hidden'
    }
    const listing_image_style = {
      ...S(`bg-cover bg-url(${listing_util.getResizeUrl(listing.cover_image_url)}?w=800) bg-center w-480 h-340 relative`)
    }
    const overlay_style = {
      ...S('bg-000 absolute w-100p h-100p br-3'),
      opacity: '.3'
    }
    const price_small = listing_util.getSmallPrice(listing.price)
    const price_tag_style = {
      ...S(`absolute b-30 p-15 pt-6 h-48 bg-${data.brand.primary} font-26 fw-500 color-fff`),
      borderTopRightRadius: '3px',
      borderBottomRightRadius: '3px'
    }
    let signup_form
    if (data.signup_tooltip && data.signup_tooltip.listing === listing.id) {
      let popover = <Popover id="popover" className="hidden" />
      if (data.errors) {
        if (data.errors.type === 'email-invalid') {
          popover = (
            <Popover id="popover" title="">You must enter a valid email</Popover>
          )
        }
        if (data.errors.type === 'bad-request') {
          popover = (
            <Popover id="popover" title="">Bad request.</Popover>
          )
        }
      }
      const signup_input_style = {
        ...S('h-46 w-230'),
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0
      }
      const signup_btn_style = {
        ...S('h-46 w-130'),
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0
      }
      let signup_title = (
        <div>
          We are on <span style={ S('color-2196f3') }>Rechat</span><span style={ S('color-2196f3 font-14 relative t-12n') }>TM</span>
        </div>
      )
      let signup_message = (
        <div>
          Sign up with Rechat to save this home and to share<br/>
          your favorites with our agent or your partner.
        </div>
      )
      if (data.signup_tooltip.action === 'listing_inquiry') {
        signup_title = (
          <div>
            Chat with me on <span style={ S('color-2196f3') }>Rechat</span><span style={ S('color-2196f3 font-14 relative t-12n') }>TM</span>
          </div>
        )
        signup_message = (
          <div>
            I'm here if you have any questions about this<br/>
            home or any other homes you like.
          </div>
        )
      }
      signup_form = (
        <div style={ S('absolute w-450 h-240 br-3 t-65 l-15 bg-fff p-20 z-2') }>
          <div onClick={ this.props.handleCloseSignupForm } className="close" style={ S('absolute r-15 t-10') }>&times;</div>
          <div className="din" style={ S('font-30 color-263445 mb-5') }>
            { signup_title }
          </div>
          <div style={ S('font-17 fw-500 color-9b9b9b mb-20 text-center') }>
            { signup_message }
          </div>
          <div style={ S('mb-5 w-100p') }>
            <form style={ S('mb-20 center-block w-360') } onSubmit={ this.props.handleEmailSubmit.bind(this) }>
              <div style={ S('pull-left') }>
                <OverlayTrigger trigger="focus" placement="bottom" overlay={ popover }>
                  <Input ref="email" style={ signup_input_style } type="text" placeholder="Enter email address" />
                </OverlayTrigger>
              </div>
              <div style={ S('pull-left') }>
                <Button className={ data.submitting ? 'disabled' : '' } bsStyle="primary" style={ signup_btn_style } type="submit">{ data.submitting ? 'Submitting...' : 'Lets Go' }</Button>
              </div>
            </form>
            <div className="clearfix"></div>
          </div>
          <div style={ S('color-9b9b9b text-center') }>Already have an account? <a href="/signin" target="_parent">Log in</a></div>
        </div>
      )
    }
    const status_color = listing_util.getStatusColor(listing.status)
    let year_built_area
    if (property.year_built) {
      year_built_area = (
        <span>
          &nbsp;&middot;&nbsp;{ property.year_built ? 'Built in ' + property.year_built : '' }
        </span>
      )
    }
    let agent_image_area
    if (listing.list_agent) {
      agent_image_area = (
        <div onClick={ this.props.handleAgentClick.bind(this, listing) } style={ S('w-60 h-60 br-100 border-2-solid-fff absolute r-10 b-50 bg-ccc p-10 pt-5') }>
          <i style={ S('font-45 color-fff') } className="fa fa-user"></i>
        </div>
      )
    }
    return (
      <div key={ 'listing-viewer-' + listing.id + '-' + helpers.randomString(10) } style={ listing_card_style }>
        <FavoriteHeart
          listing={ listing }
        />
        <div style={ listing_image_style } onClick={ this.props.handleListingClick.bind(this, listing) }>
          <div style={ overlay_style }></div>
          <div style={ price_tag_style }>${ price_small }</div>
        </div>
        <div style={ S('absolute b-0 h-80 p-10 color-000') } onClick={ this.props.handleListingClick.bind(this, listing) }>
          <div style={ S('font-20') }>{ listing_util.addressTitle(address) }</div>
          <div style={ S('font-15') }>
            <div style={ S('pull-left mr-15 ml-2 mt-13') }>
              <div style={ S('pull-left w-10 h-10 br-100 mr-8 bg-' + status_color) }></div>
              <div style={ S('pull-left mt-5n color-' + status_color) }>
                { listing.status }
              </div>
            </div>
            <div style={ S('pull-left mt-8') }>
              <span>{ property.bedroom_count } Beds</span>
              &nbsp;&middot;&nbsp;
              <span>{ property.bathroom_count } Baths</span>
              &nbsp;&middot;&nbsp;
              <span>{ square_feet } Sqft</span>
              { year_built_area }
            </div>
          </div>
        </div>
        { agent_image_area }
        { signup_form }
      </div>
    )
  }
}
ListingCard.propTypes = {
  data: React.PropTypes.object,
  listing: React.PropTypes.object,
  handleEmailSubmit: React.PropTypes.func,
  handleCloseSignupForm: React.PropTypes.func,
  handleListingClick: React.PropTypes.func,
  handleAgentClick: React.PropTypes.func
}