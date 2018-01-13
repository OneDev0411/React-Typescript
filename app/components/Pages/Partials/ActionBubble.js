// Partials/ActionBubble.js
import React, { Component } from 'react'
import { OverlayTrigger, FormControl, Button, Popover, Alert } from 'react-bootstrap'
import PropTypes from 'prop-types'
import S from 'shorti'
import Brand from '../../../controllers/Brand'
export default class ActionBubble extends Component {
  render() {
    const data = this.props.data
    const listing = this.props.listing
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
    if (data.show_listing_inquiry_error) {
      popover = (
        <Popover id="popover" title="">There was an error with this request.</Popover>
      )
    }
    const signup_input_style = {
      ...S(`h-46 ${data.is_mobile ? 'w-150' : 'w-230'}`),
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0
    }
    let signup_title = (
      <div>Stay in the know</div>
    )

    let email_label = 'Enter your email to save this home'

    if (data.signup_tooltip.action === 'listing_inquiry') {
      let chat_copy = 'Chat with Me'
      if (!listing.list_agent)
        chat_copy = 'Chat with Us'
      signup_title = (
        <div>
          { chat_copy }
        </div>
      )

      email_label = 'Enter email address'
    }
    let form_style = S(`absolute w-350 h-150 border-1-solid-ccc br-3 t-${(data.signup_tooltip.action === 'listing_inquiry') ? '75' : '75'} l-15 bg-fff p-10 pl-15 z-2`)
    if (data.is_mobile) {
      form_style = {
        ...form_style,
        ...S('t-0 l-0 w-100p')
      }
    }
    let signup_btn_style = S('h-46 w-100p')
    let button_area = (
      <Button className={data.submitting ? 'disabled' : ''} bsStyle="primary" style={signup_btn_style} type="submit">{ data.submitting ? 'Submitting...' : 'Start Chat' }</Button>
    )
    if (data.listing_inquiry_success_id && data.listing_inquiry_success_id === listing.id) {
      button_area = (
        <Alert bsStyle="success">Success!  A new chat room has been created. <a href="/dashboard/recents" target="_blank">Go to your rooms</a>.</Alert>
      )
    }
    let action_form = (
      <form style={S(`pull-left ${data.is_mobile ? 'w-300' : 'w-100p mb-10'}`)} onSubmit={this.props.handleListingInquirySubmit.bind(this)} overlay={popover}>
        { button_area }
      </form>
    )
    let login_link_area
    if (!data.user) {
      signup_btn_style = {
        ...S('h-46 w-100'),
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        backgroundColor: `#${Brand.color('primary', '006aff')}`,
        borderColor: `#${Brand.color('primary', '006aff')}`
      }
      action_form = (
        <form style={S(`pull-left ${data.is_mobile ? 'w-300' : 'w-360'}`)} onSubmit={this.props.handleEmailSubmit.bind(this)}>
          <div style={S('pull-left')}>
            <OverlayTrigger trigger="focus" placement="bottom" overlay={popover}>
              <FormControl inputRef={ref => this.emailInput = ref} style={signup_input_style} type="text" placeholder={email_label} />
            </OverlayTrigger>
          </div>
          <div style={S('pull-left')}>
            <Button className={data.submitting ? 'disabled' : ''} bsStyle="primary" style={signup_btn_style} type="submit">{ data.submitting ? 'Submitting...' : 'Lets Go' }</Button>
          </div>
        </form>
      )
      login_link_area = (
        <div style={S('color-9b9b9b text-center')}>Already have an account? <span style={S('pointer')} className="text-primary" onClick={this.props.handleLoginClick.bind(this, listing.id)}>Log in</span></div>
      )
    }
    const action_bubble = (
      <div style={form_style}>
        <div onClick={this.props.handleCloseSignupForm} className="close" style={S('absolute t-10 z-1 r-15')}>&times;</div>
        <div className="din" style={S('font-30 color-263445 mb-5')}>
          { signup_title }
        </div>
        <div style={S('mb-5 w-100p')}>
          { action_form }
          <div className="clearfix" />
        </div>
        { login_link_area }
        <i className={`fa fa-caret-${(data.signup_tooltip.action === 'listing_inquiry') ? 'down' : 'up'}`} style={S(`z-0 color-fff font-60 absolute r-15 ${(data.signup_tooltip.action === 'listing_inquiry') ? 'b-35n' : 't-35n'}`)} />
      </div>
    )
    return action_bubble
  }
}
ActionBubble.propTypes = {
  data: PropTypes.object,
  listing: PropTypes.object,
  handleEmailSubmit: PropTypes.func,
  handleListingInquirySubmit: PropTypes.func,
  handleCloseSignupForm: PropTypes.func,
  handleLoginClick: PropTypes.func,
  showIntercom: PropTypes.func
}
