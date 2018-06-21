import React from 'react'
import PropTypes from 'prop-types'

import Body from './Body'
import Header from './Header'
import Footer from './Footer'

import { Content, Backdrop } from './styled'

const propTypes = {
  width: PropTypes.number,
  isOpen: PropTypes.bool,
  showFooter: PropTypes.bool,
  closeOnBackdropClick: PropTypes.bool
}

const defaultProps = {
  width: 300,
  isOpen: false,
  showFooter: true,
  closeOnBackdropClick: true
}

function renderChildren(children, { onClose, showFooter }) {
  return React.Children.map(children, child => {
    let props = {}

    switch (child.type.displayName) {
      case 'Header':
        props = { onClose }
        break

      case 'Body':
        props = { showFooter }
        break

      case 'Footer':
        props = { showFooter }
        break
    }

    return React.cloneElement(child, props)
  })
}

const OverlayDrawer = ({
  children,
  isOpen,
  width,
  closeOnBackdropClick,
  ...rest
}) => (
  <div>
    <Content width={width} isOpen={isOpen}>
      {renderChildren(children, rest)}
    </Content>

    <Backdrop
      show={isOpen}
      onClick={() => closeOnBackdropClick && rest.onClose()}
    />
  </div>
)

OverlayDrawer.propTypes = propTypes
OverlayDrawer.defaultProps = defaultProps

OverlayDrawer.Body = Body
OverlayDrawer.Header = Header
OverlayDrawer.Footer = Footer

export default OverlayDrawer
