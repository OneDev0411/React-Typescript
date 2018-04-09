import React from 'react'
import { connect } from 'react-redux'
import IntercomSDK from 'react-intercom'

import { inactiveIntercom } from '../../../../../store_actions/intercom'

import Button from '../../../../../views/components/Button/IconButton'
import IconClose from '../../../../../views/components/SvgIcons/Close/CloseIcon'

const Intercom = ({ user, intercomIsActive, inactiveIntercom }) => {
  const intercomUser = {
    user_id: user.id,
    email: user.email,
    name: `${user.first_name} ${user.last_name}`
  }

  return (
    <div>
      {window.INTERCOM_ID && (
        <IntercomSDK appID={window.INTERCOM_ID} {...intercomUser} />
      )}
      {intercomIsActive && (
        <Button
          color="#fff"
          title="Close"
          onClick={inactiveIntercom}
          className="intercom__close-btn"
        >
          <IconClose style={{ width: 36, hieght: 36 }} />
        </Button>
      )}
    </div>
  )
}

export default connect(
  ({ user, intercom }) => ({
    user,
    intercomIsActive: intercom.isActive
  }),
  { inactiveIntercom }
)(Intercom)
