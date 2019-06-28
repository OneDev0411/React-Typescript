import React from 'react'
import { connect } from 'react-redux'
import IntercomSDK from 'react-intercom'

import { inactiveIntercom } from '../../../../../store_actions/intercom'

import IconClose from '../../../../../views/components/SvgIcons/Close/CloseIcon'

import { Button, GlobalIntercomStyles } from './styled'

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
      <GlobalIntercomStyles />
      {window.INTERCOM_ID && (
        <IntercomSDK
          appID={window.INTERCOM_ID}
          alignment="left"
          horizontal_padding={8}
          vertical_padding={0}
          custom_launcher_selector=".open_intercom"
          {...getUserInfo}
        />
      )}
      <Button
        title="Close"
        className="open_intercom"
        appearance="primary"
        onClick={inactiveIntercom}
        isShow={intercomIsActive}
      >
        <IconClose />
      </Button>
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
