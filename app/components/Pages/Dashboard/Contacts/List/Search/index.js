import React from 'react'
import PropTypes from 'prop-types'

import HeaderSearch from '../../../../../Partials/headerSearch'

import './style.scss'

Search.propTypes = {
  disabled: PropTypes.bool,
  handleOnChange: PropTypes.func.isRequired,
  inputValue: PropTypes.string.isRequired,
  isSearching: PropTypes.bool.isRequired
}

Search.defaultProps = {
  disabled: false
}

export function Search(props) {
  return (
    <div />
    // <HeaderSearch
    //   disabled={props.disabled}
    //   inputValue={props.inputValue}
    //   isSearching={props.isSearching}
    //   onInputChange={props.handleOnChange}
    //   placeholder="Search all contacts ..."
    // />
  )
}
