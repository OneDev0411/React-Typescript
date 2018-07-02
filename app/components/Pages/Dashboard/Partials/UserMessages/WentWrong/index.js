import React from 'react'
import PropTypes from 'prop-types'
import IntercomTrigger from '../../IntercomTrigger'

const WentWrong = ({ onClickSupport = () => {} }) => (
  <span>
    {
      "You have encountered an unknown system issue. We're working on it. In the meantime, connect with our"
    }
    <IntercomTrigger
      key="MLS_SEARCH_MODAL__INERCOM_TRIGGER"
      render={({ activeIntercom, intercomIsActive }) => (
        <button
          onClick={
            intercomIsActive
              ? () => false
              : () => {
                  onClickSupport()
                  activeIntercom()
                }
          }
          className="c-button--shadow--link"
        >
          Support team
        </button>
      )}
    />
    {'.'}
  </span>
)

WentWrong.propTypes = {
  onClickSupport: PropTypes.func
}

export default WentWrong
