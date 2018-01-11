import React from 'react'
import { connect } from 'react-redux'
import IntercomSDK from 'react-intercom'
import { inactiveIntercom } from '../../../../../store_actions/intercom'

const IntercomCloseButton = ({ onClick }) => (
  <button onClick={onClick} className="intercom__close-btn">
    <svg
      fill="#333"
      height="32"
      viewBox="0 0 24 24"
      width="32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>
  </button>
)

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
      {intercomIsActive && <IntercomCloseButton onClick={inactiveIntercom} />}
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
