import React from 'react'
import S from 'shorti'
import PropTypes from 'prop-types'
import Brand from '../../../../../controllers/Brand'
import controller from '../../../Dashboard/controller'

const SignUpConfirmMessage = ({
                                listing,
                                data
}) => {
  const { hideModal,
    resend,
    handleLoginClick } = controller.action_bubble
  let extra_info = ''
  if (data.resent_email_confirmation) {
    extra_info = (
      <div>
        <div>{data.new_user.email}</div>
        <div>Confirmation email resent</div>
      </div>
      )
  } else if (data.new_user) {
    extra_info = (
      <div>{data.new_user.email}</div>
      )
  }

  if (data.show_signup_confirm_modal
      && data.signup_tooltip
      && data.signup_tooltip.listing === listing.id
      && !data.new_user.email_confirmed) {
    return (
      <div style={S('absolute z-100 w-100p h-100p t-0 bg-fff')}>
        <div onClick={hideModal} className="close" style={S('font-30 t-10 r-20 absolute')}>&times;</div>
        <div className="text-center">
          <div style={S(`mb-20 mt-20 center-block text-center${!data.is_mobile ? ' mt-30 w-280' : ''}`)}>
            <img style={S('h-68 relative')} src={Brand.asset('site_logo')} />
          </div>
          <div className="din" style={S('color-263445 font-34 mb-10')}>Please verify your email</div>
          <div style={S('color-263445 font-21 mb-20')}>
            {extra_info}
          </div>
        </div>
        <div style={S('bg-e2e6ea p-20 pt-20 absolute w-100p b-0')}>
          <div className="text-center">
            <div style={S('color-9b9b9b font-16 mb-15')}>
              <div>
                  Didn’t get the email?
                </div>

              <div>
                <a onClick={resend} href="#">Resend</a> | <a href="mailto:support@rechat.com">Contact
                  support</a>.
                </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  if (data.errors
      && data.errors.type === 'email-in-use'
      && data.signup_tooltip.listing === listing.id) {
    return (
      <div style={S('absolute z-100 w-100p h-100p t-0 bg-fff')}>
        <div onClick={hideModal} className="close" style={S('font-30 t-10 r-20 absolute')}>&times;</div>
        <div className="text-center">
          <div style={S(`mb-20 mt-20 center-block text-center${!data.is_mobile ? ' mt-30 w-280' : ''}`)}>
            <img style={S('h-68 relative')} src={Brand.asset('site_logo')} />
          </div>
          <div style={S('color-9b9b9b text-center mb-20 font-21')}>This email address is already in use.</div>
          <div style={S('color-9b9b9b text-center')}>
            <span
              style={S('pointer')} className="text-primary btn btn-primary"
              onClick={() => handleLoginClick(listing.id)}
            >Log in</span>
          </div>
        </div>
        <div style={S('bg-e2e6ea p-20 pt-20 absolute w-100p b-0')}>
          <div className="text-center">
            <div style={S('color-9b9b9b font-16 mb-15')}>
              <div>
                <a href="mailto:support@rechat.com">Contact support</a>.
                </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  if (data.errors
      && data.errors.type === 'bad-request'
      && data.signup_tooltip.listing === listing.id) {
    return (
      <div style={S('absolute z-100 w-100p h-100p t-0 bg-fff')}>
        <div onClick={hideModal} className="close" style={S('font-30 t-10 r-20 absolute')}>&times;</div>
        <div className="text-center">
          <div style={S(`mb-20 mt-20 center-block text-center${!data.is_mobile ? ' mt-50 w-280' : ''}`)}>
            <img style={S('h-68 relative')} src={Brand.asset('site_logo')} />
          </div>
          <div style={S('color-9b9b9b text-center mb-20 font-21')}>There was an error with this request.</div>
          <div style={S('color-9b9b9b text-center')}>
            <span
              style={S('pointer')} className="text-primary btn btn-primary"
              onClick={() => handleLoginClick(listing.id)}
            >Log in</span>
          </div>
        </div>
        <div style={S('bg-e2e6ea p-20 pt-20 absolute w-100p b-0')}>
          <div className="text-center">
            <div style={S('color-9b9b9b font-16 mb-15')}>
              <div>
                <a href="mailto:support@rechat.com">Contact support</a>.
                </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div />
  )
}

SignUpConfirmMessage.propTypes = {
  data: PropTypes.object,
  listing: PropTypes.object,
  handleLoginClick: PropTypes.func,
  resend:PropTypes.func,
  hideModal: PropTypes.func
}

export default SignUpConfirmMessage