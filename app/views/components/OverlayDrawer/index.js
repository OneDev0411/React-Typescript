import React from 'react'
import PropTypes from 'prop-types'

import { Portal } from '../Portal'
import Body from './Body'
import Header from './Header'
import Footer from './Footer'

import { Content, Backdrop } from './styled'

const propTypes = {
  width: PropTypes.number,
  isOpen: PropTypes.bool,
  showFooter: PropTypes.bool,
  showBackdrop: PropTypes.bool,
  closeOnBackdropClick: PropTypes.bool
}

const defaultProps = {
  isOpen: false,
  showFooter: true,
  showBackdrop: true,
  closeOnBackdropClick: false
}

const OverlayDrawer = ({
  children,
  isOpen,
  width,
  showBackdrop,
  closeOnBackdropClick,
  ...rest
}) => (
  <Portal root="overlay-drawer">
    <div
      style={{ position: 'relative' }}
      data-test={`${isOpen ? 'open' : 'closed'}-drawer-overlay`}
    >
      <Content
        width={width}
        isOpen={isOpen}
        data-test={`${isOpen ? 'open' : 'closed'}-drawer-content`}
      >
        {React.Children.map(children, child => React.cloneElement(child, rest))}
      </Content>

      {showBackdrop && (
        <Backdrop
          show={isOpen}
          onClick={() => closeOnBackdropClick && rest.onClose()}
        />
      )}
    </div>
  </Portal>
)

OverlayDrawer.propTypes = propTypes
OverlayDrawer.defaultProps = defaultProps

OverlayDrawer.Body = Body
OverlayDrawer.Header = Header
OverlayDrawer.Footer = Footer

export default OverlayDrawer
