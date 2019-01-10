import React from 'react'
import PropTypes from 'prop-types'

import ActionButton from 'components/Button/ActionButton'

import Drawer from '../OverlayDrawer'
import Body from '../SelectContactModal/components/Body'

const propTypes = {
  ...Drawer.propTypes,
  defaultSearchFilter: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  onAddNewContact: PropTypes.func
}

const defaultProps = {
  ...Drawer.defaultProps,
  defaultSearchFilter: '',
  onAddNewContact: null
}

export function SearchContactDrawer(props) {
  return (
    <Drawer
      isOpen={props.isOpen}
      onClose={props.onClose}
      showFooter={props.onAddNewContact !== null}
    >
      <Drawer.Header title={props.title} />
      <Drawer.Body>
        <Body
          isDrawer
          handleSelectedItem={props.onSelect}
          defaultSearchFilter={props.defaultSearchFilter}
        />
      </Drawer.Body>

      <Drawer.Footer style={{ justifyContent: 'flex-end' }}>
        <ActionButton onClick={props.onAddNewContact}>
          Add New Contact
        </ActionButton>
      </Drawer.Footer>
    </Drawer>
  )
}

SearchContactDrawer.propTypes = propTypes
SearchContactDrawer.defaultProps = defaultProps
