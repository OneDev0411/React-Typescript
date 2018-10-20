import React from 'react'
import { connect } from 'react-redux'
import IntercomSDK from 'react-intercom'

import { inactiveIntercom } from '../../../../../store_actions/intercom'

import IconButton from '../../../../../views/components/Button/IconButton'
import IconClose from '../../../../../views/components/SvgIcons/Close/CloseIcon'

const Button = IconButton.extend`
  width: 48px;
  height: 48px;
  position: fixed;
  right: 2em;
  bottom: 2em;
  z-index: 3860017101;
  border-radius: 100%;
`

const Intercom = ({ user, intercomIsActive, inactiveIntercom }) => {
  const getUserInfo =
    user && user.id
      ? {
          user_id: user.id,
          email: user.email,
          name: `${user.first_name} ${user.last_name}`
        }
      : {}

  return (
    <div>
      {window.INTERCOM_ID && (
        <IntercomSDK appID={window.INTERCOM_ID} {...getUserInfo} />
      )}
      {intercomIsActive && (
        <Button title="Close" appearance="primary" onClick={inactiveIntercom}>
          <IconClose />
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
