import React from 'react'
import PropTypes from 'prop-types'
import Flex from 'styled-flex-component'

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
    <Flex justifyBetween style={{ padding: '1.5em 2.5em' }}>
      <Catalog contact={props.contact} />
      <Menu
        contact={props.contact}
        backUrl={props.backUrl}
        closeButtonQuery={props.closeButtonQuery}
        addToFlowCallback={props.addToFlowCallback}
      />
    </Flex>
  )
}
