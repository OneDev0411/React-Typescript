import React from 'react'
import PropTypes from 'prop-types'

import HeaderSearch from '../../../../../Partials/headerSearch'

import './style.scss'

Filters.propTypes = {
  handleOnChange: PropTypes.func.isRequired,
  inputValue: PropTypes.string.isRequired,
  isSearching: PropTypes.bool.isRequired
}

export function Filters(props) {
  return (
    <HeaderSearch
      inputValue={props.inputValue}
      isSearching={props.isSearching}
      onInputChange={props.handleOnChange}
      placeholder="Search all contacts ..."
    />
  )
}
