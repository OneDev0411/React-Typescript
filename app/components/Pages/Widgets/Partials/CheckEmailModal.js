import React, { Component } from 'react'
import { Modal } from 'react-bootstrap'
import S from 'shorti'
import PropTypes from 'prop-types'

export default class CheckEmailModal extends Component {
  render() {
    const data = this.props.data
    let resent_message_area
    if (data.resent_email_confirmation) {
      resent_message_area = (
        <div style={S('mt-20 mb-20')}>Confirmation email resent.</div>
      )
    }
    return (
      <Modal dialogClassName={data.is_mobile ? 'modal-mobile' : ''} show={!data.show_signup_confirm_modal} onHide={this.props.hideModal}>
        <Modal.Body className="text-center" style={!data.is_mobile ? S('w-600 h-480') : S('w-100p')} >
          <div style={S(`mb-20 mt-20 center-block text-center${!data.is_mobile ? ' mt-100 w-280' : ''}`)}>
            <img style={S('h-68 mr-40 relative')} src={data.brand ? data.brand.assets.logo : ''} />
            <i style={S('color-929292 mr-40 font-30 relative t-5')} className="fa fa-arrow-right" />
            <img style={S('h-68')} src="/static/images/logo-200w.png" />
          </div>
          <div className="din" style={S('color-263445 font-34 mb-10')}>Great! Please verify your email</div>
          <div style={S('font-17 color-9b9b9b mb-40')}>It may take a few minutes for<br /> the email to show up.</div>
          <div style={S('color-263445 font-21 mb-20')}>
            { data.new_user ? data.new_user.email : '' }
          </div>
          <div style={S('color-9b9b9b font-16 mb-20')}>
            Didn’t get the email? <a onClick={this.props.resend.bind(this)} href="#">Resend</a> or <a onClick={this.props.showIntercom} href="#">contact support</a>.
          </div>
          { resent_message_area }
        </Modal.Body>
        <Modal.Footer style={S('bg-e2e6ea br-3')}>
          <div className="text-center">
            Powered by <a href="https://rechat.com" target="_blank" style={S('color-2196f3 fw-500')}>Rechat<span style={S('color-2196f3 font-9 relative t-7n fw-500')}>TM</span></a>
          </div>
        </Modal.Footer>
      </Modal>
    )
  }
}
CheckEmailModal.propTypes = {
  data: PropTypes.object,
  hideModal: PropTypes.func,
  showIntercom: PropTypes.func,
  resend: PropTypes.func
}
