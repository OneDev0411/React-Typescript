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
    let listing_card_style = {
      ...S(`w-480 h-420 mr-10 ml-10 mb-20 pull-left br-3 pointer relative`),
      boxShadow: '0 0 2px 0 rgba(0, 0, 0, 0.2)',
      overflow: 'hidden'
    }
    const listing_image_style = {
      ...S(`bg-cover bg-url(${listing_util.getResizeUrl(listing.cover_image_url)}?w=800) bg-center w-480 h-340 relative`)
    }
    // Responsive
    if (typeof window !== 'undefined' && window.innerWidth < 1000) {
      listing_card_style.width = window.innerWidth - 20
      listing_card_style.height = listing_card_style.width * '.4'
      listing_card_style = {
        ...listing_card_style,
        ...S('ml-15')
      }
      if (window.innerWidth < 500)
        listing_card_style.height = listing_card_style.width * '.6'
      listing_image_style.width = listing_card_style.width
      listing_image_style.height = listing_card_style.height - 80
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
    let action_bubble
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
        ...S(`h-46 ${data.is_mobile ? 'w-150' : 'w-230'}`),
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0
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
      let form_style = S('absolute w-450 h-220 br-3 t-75 l-15 bg-fff p-10 pl-15 z-2')
      if (data.is_mobile) {
        form_style = {
          ...form_style,
          ...S('t-0 l-0 w-100p')
        }
      }
      let signup_btn_style = S('h-46 w-100p')
      let action_form = (
        <form style={ S('pull-left ' + (data.is_mobile ? 'w-300' : 'w-100p mb-10')) } onSubmit={ this.props.handleListingInquirySubmit.bind(this) }>
          <Button className={ data.submitting ? 'disabled' : '' } bsStyle="primary" style={ signup_btn_style } type="submit">{ data.submitting ? 'Submitting...' : 'Start Chat' }</Button>
        </form>
      )
      let login_link_area
      if (!data.user) {
        signup_btn_style = {
          ...S('h-46 w-130'),
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0
        }
        action_form = (
          <form style={ S('pull-left ' + (data.is_mobile ? 'w-300' : 'w-360')) } onSubmit={ this.props.handleEmailSubmit.bind(this) }>
            <div style={ S('pull-left') }>
              <OverlayTrigger trigger="focus" placement="bottom" overlay={ popover }>
                <Input ref="email" style={ signup_input_style } type="text" placeholder="Enter email address" />
              </OverlayTrigger>
            </div>
            <div style={ S('pull-left') }>
              <Button className={ data.submitting ? 'disabled' : '' } bsStyle="primary" style={ signup_btn_style } type="submit">{ data.submitting ? 'Submitting...' : 'Lets Go' }</Button>
            </div>
          </form>
        )
        login_link_area = (
          <div style={ S('color-9b9b9b text-center') }>Already have an account? <a href="/signin" target="_parent">Log in</a></div>
        )
      }
      action_bubble = (
        <div style={ form_style }>
          <div onClick={ this.props.handleCloseSignupForm } className="close" style={ S('absolute t-10 z-1 r-15') }>&times;</div>
          <div className="din" style={ S('font-30 color-263445 mb-5') }>
            { signup_title }
          </div>
          <div style={ S('fw-500 color-9b9b9b mb-20 text-left' + (!data.is_mobile ? ' font-17' : 'font-14')) }>
            { signup_message }
          </div>
          <div style={ S('mb-5 w-100p') }>
            { action_form }
            <div className="clearfix"></div>
          </div>
          { login_link_area }
          <i className={`fa fa-caret-${(data.signup_tooltip.action === 'listing_inquiry') ? 'down' : 'up'}`} style={ S(`z-0 color-fff font-60 absolute r-15 ${(data.signup_tooltip.action === 'listing_inquiry') ? 'b-35n' : 't-35n'}`) }></i>
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
      let avatar = (
        <i style={ S('font-38 color-fff ml-10 mt-5') } className="fa fa-user"></i>
      )
      const profile_image_url = listing.list_agent.profile_image_url
      if (profile_image_url) {
        avatar = (
          <div style={ S(`bg-url(${profile_image_url}) w-50 h-50 bg-center bg-cover br-100`) }></div>
        )
      }
      let online_indicator
      let bg_color = 'dddfe0'
      if (listing.list_agent.is_online)
        bg_color = '35b863'
      online_indicator = <div style={ S('br-100 bg-' + bg_color + ' w-13 h-13 bw-2 solid bc-fff absolute z-2 t-2n r-2') }></div>
      agent_image_area = (
        <div onClick={ this.props.handleAgentClick.bind(this, listing) } style={ S('p-0 w-55 h-55 br-100 border-2-solid-fff absolute r-20 b-50 bg-ccc') }>
          { online_indicator }
          { avatar }
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
            <div style={ S('pull-left mr-10 mt-13' + (data.is_mobile ? ' font-14' : '')) }>
              <div style={ S('pull-left w-10 h-10 br-100 mr-8 bg-' + status_color) }></div>
              <div style={ S('pull-left mt-5n color-' + status_color) }>
                { listing.status }
              </div>
            </div>
            <div style={ S('pull-left mt-8' + (data.is_mobile ? ' font-14' : '')) }>
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
        { action_bubble }
      </div>
    )
  }
}
ListingCard.propTypes = {
  data: React.PropTypes.object,
  listing: React.PropTypes.object,
  handleEmailSubmit: React.PropTypes.func,
  handleListingInquirySubmit: React.PropTypes.func,
  handleCloseSignupForm: React.PropTypes.func,
  handleListingClick: React.PropTypes.func,
  handleAgentClick: React.PropTypes.func
}