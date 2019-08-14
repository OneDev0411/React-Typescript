import React from 'react'
import PropTypes from 'prop-types'

import Item from './Item'

List.propTypes = {
  items: PropTypes.arrayOf().isRequired,
  onStop: PropTypes.func.isRequired
}

export function List(props) {
  return props.items.map(item => (
    <Item key={item.id} flow={item} onStop={props.onStop} />
  ))
}
