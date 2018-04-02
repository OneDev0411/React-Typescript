import React from 'react'
import PropTypes from 'prop-types'

import FullScreenModal from '../FullScreenModal'

const propTypes = {
  className: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired
}

function FullPageModal({ className, ...props }) {
  return (
    <FullScreenModal
      {...props}
      overlayClassName="c-full-screen-modal--page"
      className={`c-full-screen-modal--page ${className}`}
    />
  )
}

FullPageModal.propTypes = propTypes

export default FullPageModal
