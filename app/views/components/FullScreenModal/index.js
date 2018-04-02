import React from 'react'
import PropTypes from 'prop-types'
import BareModal from '../BareModal'

import Header from './components/Header'
import Body from './components/Body'

const propTypes = {
  className: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired
}

function FullScreenModal({
  title,
  children,
  className,
  handleClose,
  ...props
}) {
  return (
    <BareModal
      {...props}
      contentLabel={title}
      onRequestClose={handleClose}
      className={`c-full-screen-modal ${className}`}
    >
      <Header title={title} onClose={handleClose} />
      <Body>{children}</Body>
    </BareModal>
  )
}

FullScreenModal.propTypes = propTypes

export default FullScreenModal
