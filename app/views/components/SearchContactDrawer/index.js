import React from 'react'
import PropTypes from 'prop-types'

import Drawer from '../OverlayDrawer'
import Body from '../SelectContactModal/components/Body'

const propTypes = {
  ...Drawer.propTypes,
  defaultSearchFilter: PropTypes.string,
  onSelect: PropTypes.func.isRequired
}

const defaultProps = {
  ...Drawer.defaultProps,
  defaultSearchFilter: ''
}

export function SearchContactDrawer(props) {
  return (
    <Drawer isOpen={props.isOpen} onClose={props.onClose} showFooter={false}>
      <Drawer.Header title={props.title} />
      <Drawer.Body>
        <Body
          isDrawer
          handleSelectedItem={props.onSelect}
          defaultSearchFilter={props.defaultSearchFilter}
        />
      </Drawer.Body>
    </Drawer>
  )
}

SearchContactDrawer.propTypes = propTypes
SearchContactDrawer.defaultProps = defaultProps
