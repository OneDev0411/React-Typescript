// Partials/FilterForm.js
import React, { Component } from 'react'
// import { Button, DropdownButton, MenuItem } from 'react-bootstrap'
import S from 'shorti'
// import helpers from '../../../../../utils/helpers'
// import listing_util from '../../../../../utils/listing'

export default class FilterForm extends Component {
  render() {
    const data = this.props.data
    const filter_form_style = S('w-300 absolute bg-fff t-62 h-' + (window.innerHeight - 62))
    if (!data.show_filter_form)
      return <div></div>
    return (
      <div style={ filter_form_style }>
        <div style={ S('border-bottom-1-solid-f3f6f7 h-50') }></div>
        <div style={ S('border-bottom-1-solid-f3f6f7 h-50') }></div>
        <div style={ S('border-bottom-1-solid-f3f6f7 h-50') }></div>
        <div style={ S('border-bottom-1-solid-f3f6f7 h-50') }></div>
        <div style={ S('border-bottom-1-solid-f3f6f7 h-50') }></div>
        <div style={ S('border-bottom-1-solid-f3f6f7 h-50') }></div>
        <div style={ S('border-bottom-1-solid-f3f6f7 h-50') }></div>
      </div>
    )
  }
}

// PropTypes
FilterForm.propTypes = {
  data: React.PropTypes.object
}