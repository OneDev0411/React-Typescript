import React from 'react'

import PropTypes from 'prop-types'

import BareModal from '../BareModal'

import Body from './components/Body'
import Footer from './components/Footer'
import Header from './components/Header'

const propTypes = {
  title: PropTypes.string,
  className: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  handleOnClose: PropTypes.func.isRequired
}

const defaultProps = {
  title: ''
}

const BasicModal = ({
  title,
  isOpen,
  children,
  className,
  handleOnClose,
  noFooter = false,
  shouldCloseOnOverlayClick = false,
  ...rest
}) => (
  <BareModal
    autoHeight
    isOpen={isOpen}
    shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
    contentLabel={title}
    onRequestClose={handleOnClose}
    noFooter={noFooter}
    className={className}
    {...rest}
  >
    {children}
  </BareModal>
)

BasicModal.propTypes = propTypes
BasicModal.defaultProps = defaultProps

BasicModal.Body = Body
BasicModal.Header = Header
BasicModal.Footer = Footer

export default BasicModal
