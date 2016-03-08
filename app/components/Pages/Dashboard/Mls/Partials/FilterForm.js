// Partials/FilterForm.js
import React, { Component } from 'react'
import { Button, Input } from 'react-bootstrap'
import S from 'shorti'
// import helpers from '../../../../../utils/helpers'
// import listing_util from '../../../../../utils/listing'
import Switch from 'react-ios-switch'

export default class FilterForm extends Component {
  buttonIsActive(key, value) {
    const data = this.props.data
    let filter_options
    if (!data.listing_map)
      return false
    if (data.listing_map.filter_options)
      filter_options = data.listing_map.filter_options
    if (filter_options && key === 'listing_types') {
      if (filter_options.listing_types && filter_options.listing_types.indexOf(value) !== -1)
        return true
    }
    if (filter_options && filter_options[key] === value)
      return true
    return false
  }
  handleOptionChange(key) {
    const value = this.refs[key].refs.input.value
    this.props.handleOptionChange(key, value)
  }
  render() {
    const data = this.props.data
    const filter_form_style = S('w-300 absolute bg-fff t-62 font-15 pb-100 h-' + (window.innerHeight - 62))
    const filter_scroll_area_style = {
      ...S('h-' + (window.innerHeight - 97)),
      overflowY: 'scroll'
    }
    let filter_form_class = 'listing-map__filter-form'
    if (data.show_filter_form)
      filter_form_class += ' active'
    let filter_options
    if (data.listing_map) {
      const listing_map = data.listing_map
      if (listing_map.filter_options)
        filter_options = data.listing_map.filter_options
    }
    return (
      <div className={ filter_form_class } style={ filter_form_style }>
        <form onSubmit={ this.props.setFilterOptions.bind(this) }>
          <div style={ filter_scroll_area_style }>
            <div style={ S('border-bottom-1-solid-f3f6f7 h-50 p-15') }>
              Sold
              <div style={ S('pull-right') }>
                <Switch checked={ filter_options ? filter_options.sold : false } onChange={ this.props.handleFilterSwitch.bind(this, 'sold') } />
              </div>
            </div>
            <div style={ S('border-bottom-1-solid-f3f6f7 h-50 p-15') }>
              Active
              <div style={ S('pull-right') }>
                <Switch checked={ filter_options ? filter_options.active : false } onChange={ this.props.handleFilterSwitch.bind(this, 'active') } />
              </div>
            </div>
            <div style={ S('border-bottom-1-solid-f3f6f7 h-50 p-15') }>
              Other Listing Status
              <div style={ S('pull-right') }>
                <Switch checked={ filter_options ? filter_options.other : false } onChange={ this.props.handleFilterSwitch.bind(this, 'other') } />
              </div>
            </div>
            <div style={ S('border-bottom-1-solid-f3f6f7 h-50 p-15') }>
              Open Houses Only
              <div style={ S('pull-right') }>
                <Switch checked={ filter_options ? filter_options.open_houses : false } onChange={ this.props.handleFilterSwitch.bind(this, 'open_houses') } />
              </div>
            </div>
            <div style={ S('pl-15 pt-15') }>
              <div>Listing Types</div>
              <Button bsStyle="default" style={ this.buttonIsActive('listing_types', 'any') ? S('mr-10 bg-667688 bc-667688') : S('mr-10 bg-fff') } onClick={ this.props.handleFilterButton.bind(this, { key: 'listing_types', value: 'any' }) }>
                <div style={ S('mb-10') }>
                  <img src={`/images/dashboard/mls/listing-types/any${this.buttonIsActive('listing_types', 'any') ? '-active' : ''}.svg`}/>
                </div>
                <span style={ S(`font-10 color-${this.buttonIsActive('listing_types', 'any') ? 'fff' : '929292'}`) }>Any</span>
              </Button>
              <Button bsStyle="default" style={ this.buttonIsActive('listing_types', 'house') ? S('mr-10 bg-667688 bc-667688') : S('mr-10 bg-fff') } onClick={ this.props.handleFilterButton.bind(this, { key: 'listing_types', value: 'house' }) }>
                <div style={ S('mb-10') }>
                  <img src={`/images/dashboard/mls/listing-types/house${this.buttonIsActive('listing_types', 'house') ? '-active' : ''}.svg`}/>
                </div>
                <span style={ S(`font-10 color-${this.buttonIsActive('listing_types', 'house') ? 'fff' : '929292'}`) }>House</span>
              </Button>
              <Button bsStyle="default" style={ this.buttonIsActive('listing_types', 'condo') ? S('mr-10 bg-667688 bc-667688') : S('mr-10 bg-fff') } onClick={ this.props.handleFilterButton.bind(this, { key: 'listing_types', value: 'condo' }) }>
                <div style={ S('mb-10') }>
                  <img src={`/images/dashboard/mls/listing-types/condo${this.buttonIsActive('listing_types', 'condo') ? '-active' : ''}.svg`}/>
                </div>
                <span style={ S(`font-10 color-${this.buttonIsActive('listing_types', 'condo') ? 'fff' : '929292'}`) }>Condo</span>
              </Button>
              <Button bsStyle="default" style={ this.buttonIsActive('listing_types', 'townhouse') ? S('mr-10 bg-667688 bc-667688') : S('mr-10 bg-fff') } onClick={ this.props.handleFilterButton.bind(this, { key: 'listing_types', value: 'townhouse' }) }>
                <div style={ S('mb-10') }>
                  <img src={`/images/dashboard/mls/listing-types/townhouse${this.buttonIsActive('listing_types', 'townhouse') ? '-active' : ''}.svg`}/>
                </div>
                <span style={ S(`font-10 color-${this.buttonIsActive('listing_types', 'townhouse') ? 'fff' : '929292'}`) }>Townhouse</span>
              </Button>
            </div>
            <div style={ S('p-15') }>
              <div>Price Range</div>
              <div>
                <div style={ S('w-50p pull-left') }>
                  <Input onChange={ this.handleOptionChange.bind(this, 'minimum_price') } value={ filter_options && filter_options.minimum_price ? filter_options.minimum_price : '' } ref="minimum_price" type="text" placeholder="Min"/>
                </div>
                <div style={ S('w-50p pull-left') }>
                  <Input onChange={ this.handleOptionChange.bind(this, 'maximum_price') } value={ filter_options && filter_options.maximum_price ? filter_options.maximum_price : '' } ref="maximum_price" type="text" placeholder="Max"/>
                </div>
              </div>
            </div>
            <div style={ S('p-15') }>
              <div>
                Bedrooms
              </div>
              <Button bsStyle="default" style={ this.buttonIsActive('minimum_bedrooms', 1) ? S('mr-10 bg-667688 bc-667688 color-fff') : S('mr-10 bg-fff') } onClick={ this.props.handleFilterButton.bind(this, { key: 'minimum_bedrooms', value: '1' }) }>+1</Button>
              <Button bsStyle="default" style={ this.buttonIsActive('minimum_bedrooms', 2) ? S('mr-10 bg-667688 bc-667688 color-fff') : S('mr-10 bg-fff') } onClick={ this.props.handleFilterButton.bind(this, { key: 'minimum_bedrooms', value: '2' }) }>+2</Button>
              <Button bsStyle="default" style={ this.buttonIsActive('minimum_bedrooms', 3) ? S('mr-10 bg-667688 bc-667688 color-fff') : S('mr-10 bg-fff') } onClick={ this.props.handleFilterButton.bind(this, { key: 'minimum_bedrooms', value: '3' }) }>+3</Button>
            </div>
            <div style={ S('p-15') }>
              <div>
                Bathrooms
              </div>
              <Button bsStyle="default" style={ this.buttonIsActive('minimum_bathrooms', 1) ? S('mr-10 bg-667688 bc-667688 color-fff') : S('mr-10 bg-fff') } onClick={ this.props.handleFilterButton.bind(this, { key: 'minimum_bathrooms', value: '1' }) }>+1</Button>
              <Button bsStyle="default" style={ this.buttonIsActive('minimum_bathrooms', 2) ? S('mr-10 bg-667688 bc-667688 color-fff') : S('mr-10 bg-fff') } onClick={ this.props.handleFilterButton.bind(this, { key: 'minimum_bathrooms', value: '2' }) }>+2</Button>
              <Button bsStyle="default" style={ this.buttonIsActive('minimum_bathrooms', 3) ? S('mr-10 bg-667688 bc-667688 color-fff') : S('mr-10 bg-fff') } onClick={ this.props.handleFilterButton.bind(this, { key: 'minimum_bathrooms', value: '3' }) }>+3</Button>
            </div>
            <div style={ S('p-15') }>
              <div>Square Footage</div>
              <div>
                <div style={ S('w-50p pull-left') }>
                  <Input onChange={ this.handleOptionChange.bind(this, 'minimum_square_feet') } value={ filter_options && filter_options.minimum_square_feet ? filter_options.minimum_square_feet : '' } ref="minimum_square_feet" type="text" placeholder="Min"/>
                </div>
                <div style={ S('w-50p pull-left') }>
                  <Input onChange={ this.handleOptionChange.bind(this, 'maximum_square_feet') } value={ filter_options && filter_options.maximum_square_feet ? filter_options.maximum_square_feet : '' } ref="maximum_square_feet" type="text" placeholder="Max"/>
                </div>
              </div>
            </div>
            <div style={ S('p-15') }>
              <div>
                Pool
              </div>
              <Button bsStyle="default" style={ this.buttonIsActive('pool', true) ? S('mr-10 bg-667688 bc-667688 color-fff') : S('mr-10 bg-fff') } onClick={ this.props.handleFilterButton.bind(this, { key: 'pool', value: true }) }>Yes</Button>
              <Button bsStyle="default" style={ this.buttonIsActive('pool', false) ? S('mr-10 bg-667688 bc-667688 color-fff') : S('mr-10 bg-fff') } onClick={ this.props.handleFilterButton.bind(this, { key: 'pool', value: false }) }>No</Button>
              <Button bsStyle="default" style={ this.buttonIsActive('pool', 'either') ? S('mr-10 bg-667688 bc-667688 color-fff') : S('mr-10 bg-fff') } onClick={ this.props.handleFilterButton.bind(this, { key: 'pool', value: 'either' }) }>Either</Button>
            </div>
          </div>
          <div style={ S('absolute b-0 w-300') }>
            <Button onClick={ this.props.resetFilterOptions.bind(this) } style={ { ...S('color-fff bg-c5cdd8 w-50p br-0'), border: 'none' } }>Reset Filter</Button>
            <Button type="submit" bsStyle="primary" style={ { ...S('w-50p br-0'), border: 'none' } }>Update Filter</Button>
          </div>
        </form>
      </div>
    )
  }
}

// PropTypes
FilterForm.propTypes = {
  data: React.PropTypes.object,
  handleFilterSwitch: React.PropTypes.func,
  handleFilterButton: React.PropTypes.func,
  resetFilterOptions: React.PropTypes.func,
  setFilterOptions: React.PropTypes.func,
  handleOptionChange: React.PropTypes.func
}