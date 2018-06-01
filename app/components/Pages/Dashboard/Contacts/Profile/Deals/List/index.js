import React from 'react'
import PropTypes from 'prop-types'

import { Item } from './Item'

List.propTypes = {
  list: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  handleOnClickItem: PropTypes.func.isRequired
}

export function List(props) {
  return props.list.map(item => (
    <Item key={item.id} item={item} onClick={props.handleOnClickItem} />
  ))
}
