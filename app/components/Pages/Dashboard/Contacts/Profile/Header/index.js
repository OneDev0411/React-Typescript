import React from 'react'
import PropTypes from 'prop-types'

import Menu from './Menu'
import { Catalog } from './Catalog'

Header.propTypes = {
  contact: PropTypes.shape().isRequired,
  addToFlowCallback: PropTypes.func
}

Header.defaultProps = {
  addToFlowCallback() {}
}

export function Header(props) {
  return (
    <>
      <Catalog contact={props.contact} />
      <Menu
        contact={props.contact}
        backUrl={props.backUrl}
        closeButtonQuery={props.closeButtonQuery}
        addToFlowCallback={props.addToFlowCallback}
      />
    </>
  )
}
