// Partials/FilterForm.js
import React, { Component } from 'react'
import { Button } from 'react-bootstrap'
// import { Button, DropdownButton, MenuItem } from 'react-bootstrap'
import S from 'shorti'
// import helpers from '../../../../../utils/helpers'
// import listing_util from '../../../../../utils/listing'
import Switch from 'react-ios-switch'

export default class FilterForm extends Component {
  render() {
    const data = this.props.data
    const filter_form_style = S('w-300 absolute bg-fff t-62 font-15 h-' + (window.innerHeight - 62))
    let filter_form_class = 'listing-map__filter-form'
    if (data.show_filter_form)
      filter_form_class += ' active'
    return (
      <div className={ filter_form_class } style={ filter_form_style }>
        <div style={ S('border-bottom-1-solid-f3f6f7 h-50 p-15') }>
          Solds
          <div style={ S('pull-right') }>
            <Switch checked={ data.listing_map.filtering ? data.listing_map.filtering.solds : false } onChange={ this.props.handleFilterSwitch.bind(this, 'solds') } />
          </div>
        </div>
        <div style={ S('border-bottom-1-solid-f3f6f7 h-50 p-15') }>
          Active
          <div style={ S('pull-right') }>
            <Switch checked={ data.listing_map.filtering ? data.listing_map.filtering.active : false } onChange={ this.props.handleFilterSwitch.bind(this, 'active') } />
          </div>
        </div>
        <div style={ S('border-bottom-1-solid-f3f6f7 h-50 p-15') }>
          Other Listing Status
          <div style={ S('pull-right') }>
            <Switch checked={ data.listing_map.filtering ? data.listing_map.filtering.other : false } onChange={ this.props.handleFilterSwitch.bind(this, 'other') } />
          </div>
        </div>
        <div style={ S('border-bottom-1-solid-f3f6f7 h-50 p-15') }>
          Open Houses Only
          <div style={ S('pull-right') }>
            <Switch checked={ data.listing_map.filtering ? data.listing_map.filtering.open_houses : false } onChange={ this.props.handleFilterSwitch.bind(this, 'open_houses') } />
          </div>
        </div>
        <div style={ S('p-15') }>
          <div>Listing Types</div>
          <Button>
            <img src={`/images/dashboard/mls/listing-types/any.svg`}/>
          </Button>
          <Button>
            <img src={`/images/dashboard/mls/listing-types/home.svg`}/>
          </Button>
          <Button>
            <img src={`/images/dashboard/mls/listing-types/condo.svg`}/>
          </Button>
          <Button>
            <img src={`/images/dashboard/mls/listing-types/townhouse.svg`}/>
          </Button>
        </div>
        <div>
          Price Range
        </div>
        <div>
          Bedrooms
        </div>
        <div>
          Bathrooms
        </div>
        <div>
          Square Footage
        </div>
        <div>
          Pool
        </div>
      </div>
    )
  }
}

// PropTypes
FilterForm.propTypes = {
  data: React.PropTypes.object,
  handleFilterSwitch: React.PropTypes.func
}