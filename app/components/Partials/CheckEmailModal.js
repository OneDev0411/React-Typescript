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
      <Modal dialogClassName={data.is_mobile ? 'modal-mobile' : ''} show={data.show_signup_confirm_modal} onHide={this.props.hideModal}>
        <Modal.Body className="text-center">
          <div style={S('mb-20 mt-20')}>
            <div style={S('br-100 w-90 h-90 center-block bg-3388ff text-center')}>
              <i style={S('color-fff font-40 mt-25')} className="fa fa-check" />
            </div>
          </div>
          <div className="din" style={S('font-30 mb-10')}>Check Your Inbox</div>
          <div style={S('w-50 h-2 bg-d8d8d8 center-block')} />
          <div style={S('color-9b9b9b font-15 mt-21 mb-20')}>
            For a secure experience, confirm your email address to continue.
          </div>
          <div style={S('color-263445 font-21 mb-20')}>
            { data.new_user ? data.new_user.email : '' }
          </div>
          <div style={S('color-9b9b9b font-13 mb-20')}>
            Didn’t get the email? <a onClick={this.props.resend.bind(this)} href="#">Resend</a> or <a onClick={this.props.showIntercom} href="#">contact support</a>.
          </div>
          { resent_message_area }
        </Modal.Body>
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