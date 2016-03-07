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
    let filtering_options
    if (!data.listing_map)
      return false
    if (data.listing_map.filtering_options)
      filtering_options = data.listing_map.filtering_options
    if (filtering_options && key === 'listing_types') {
      if (filtering_options.listing_types && filtering_options.listing_types.indexOf(value) !== -1)
        return true
    }
    if (filtering_options && filtering_options[key] === value)
      return true
    return false
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
    let filtering_options
    let options
    if (data.listing_map) {
      const listing_map = data.listing_map
      if (listing_map.filtering_options)
        filtering_options = data.listing_map.filtering_options
      options = listing_map.options
    }
    return (
      <div className={ filter_form_class } style={ filter_form_style }>
        <form onSubmit={ this.props.setFilterOptions.bind(this) }>
          <div style={ filter_scroll_area_style }>
            <div style={ S('border-bottom-1-solid-f3f6f7 h-50 p-15') }>
              Sold
              <div style={ S('pull-right') }>
                <Switch checked={ filtering_options ? filtering_options.sold : false } onChange={ this.props.handleFilterSwitch.bind(this, 'sold') } />
              </div>
            </div>
            <div style={ S('border-bottom-1-solid-f3f6f7 h-50 p-15') }>
              Active
              <div style={ S('pull-right') }>
                <Switch checked={ filtering_options ? filtering_options.active : false } onChange={ this.props.handleFilterSwitch.bind(this, 'active') } />
              </div>
            </div>
            <div style={ S('border-bottom-1-solid-f3f6f7 h-50 p-15') }>
              Other Listing Status
              <div style={ S('pull-right') }>
                <Switch checked={ filtering_options ? filtering_options.other : false } onChange={ this.props.handleFilterSwitch.bind(this, 'other') } />
              </div>
            </div>
            <div style={ S('border-bottom-1-solid-f3f6f7 h-50 p-15') }>
              Open Houses Only
              <div style={ S('pull-right') }>
                <Switch checked={ filtering_options ? filtering_options.open_houses : false } onChange={ this.props.handleFilterSwitch.bind(this, 'open_houses') } />
              </div>
            </div>
            <div style={ S('pl-15 pt-15') }>
              <div>Listing Types</div>
              <Button bsStyle={ this.buttonIsActive('listing_types', 'any') ? 'primary' : 'default' } onClick={ this.props.handleFilterButton.bind(this, { key: 'listing_types', value: 'any' }) }>
                <div style={ S('mb-10') }>
                  <img src={`/images/dashboard/mls/listing-types/any${this.buttonIsActive('listing_types', 'any') ? '-active' : ''}.svg`}/>
                </div>
                <span style={ S(`color-${this.buttonIsActive('listing_types', 'any') ? 'fff' : '929292'}`) }>Any</span>
              </Button>
              <Button bsStyle={ this.buttonIsActive('listing_types', 'house') ? 'primary' : 'default' } onClick={ this.props.handleFilterButton.bind(this, { key: 'listing_types', value: 'house' }) }>
                <div style={ S('mb-10') }>
                  <img src={`/images/dashboard/mls/listing-types/house${this.buttonIsActive('listing_types', 'house') ? '-active' : ''}.svg`}/>
                </div>
                <span style={ S(`color-${this.buttonIsActive('listing_types', 'house') ? 'fff' : '929292'}`) }>House</span>
              </Button>
              <Button bsStyle={ this.buttonIsActive('listing_types', 'condo') ? 'primary' : 'default' } onClick={ this.props.handleFilterButton.bind(this, { key: 'listing_types', value: 'condo' }) }>
                <div style={ S('mb-10') }>
                  <img src={`/images/dashboard/mls/listing-types/condo${this.buttonIsActive('listing_types', 'condo') ? '-active' : ''}.svg`}/>
                </div>
                <span style={ S(`color-${this.buttonIsActive('listing_types', 'condo') ? 'fff' : '929292'}`) }>Condo</span>
              </Button>
              <Button bsStyle={ this.buttonIsActive('listing_types', 'townhouse') ? 'primary' : 'default' } onClick={ this.props.handleFilterButton.bind(this, { key: 'listing_types', value: 'townhouse' }) }>
                <div style={ S('mb-10') }>
                  <img src={`/images/dashboard/mls/listing-types/townhouse${this.buttonIsActive('listing_types', 'townhouse') ? '-active' : ''}.svg`}/>
                </div>
                <span style={ S(`color-${this.buttonIsActive('listing_types', 'townhouse') ? 'fff' : '929292'}`) }>Townhouse</span>
              </Button>
            </div>
            <div style={ S('p-15') }>
              <div>Price Range</div>
              <div>
                <div style={ S('w-50p pull-left') }>
                  <Input defaultValue={ options && options.minimum_price ? options.minimum_price : '' } ref="minimum_price" type="text" placeholder="Min"/>
                </div>
                <div style={ S('w-50p pull-left') }>
                  <Input defaultValue={ options && options.maximum_price ? options.maximum_price : '' } ref="maximum_price" type="text" placeholder="Max"/>
                </div>
              </div>
            </div>
            <div style={ S('p-15') }>
              <div>
                Bedrooms
              </div>
              <Button style={ S('mr-10') } bsStyle={ this.buttonIsActive('minimum_bedrooms', 1) ? 'primary' : 'default' } onClick={ this.props.handleFilterButton.bind(this, { key: 'minimum_bedrooms', value: '1' }) }>+1</Button>
              <Button style={ S('mr-10') } bsStyle={ this.buttonIsActive('minimum_bedrooms', 2) ? 'primary' : 'default' } onClick={ this.props.handleFilterButton.bind(this, { key: 'minimum_bedrooms', value: '2' }) }>+2</Button>
              <Button style={ S('mr-10') } bsStyle={ this.buttonIsActive('minimum_bedrooms', 3) ? 'primary' : 'default' } onClick={ this.props.handleFilterButton.bind(this, { key: 'minimum_bedrooms', value: '3' }) }>+3</Button>
            </div>
            <div style={ S('p-15') }>
              <div>
                Bathrooms
              </div>
              <Button style={ S('mr-10') } bsStyle={ this.buttonIsActive('minimum_bathrooms', 1) ? 'primary' : 'default' } onClick={ this.props.handleFilterButton.bind(this, { key: 'minimum_bathrooms', value: '1' }) }>+1</Button>
              <Button style={ S('mr-10') } bsStyle={ this.buttonIsActive('minimum_bathrooms', 2) ? 'primary' : 'default' } onClick={ this.props.handleFilterButton.bind(this, { key: 'minimum_bathrooms', value: '2' }) }>+2</Button>
              <Button style={ S('mr-10') } bsStyle={ this.buttonIsActive('minimum_bathrooms', 3) ? 'primary' : 'default' } onClick={ this.props.handleFilterButton.bind(this, { key: 'minimum_bathrooms', value: '3' }) }>+3</Button>
            </div>
            <div style={ S('p-15') }>
              <div>Square Footage</div>
              <div>
                <div style={ S('w-50p pull-left') }>
                  <Input defaultValue={ options && options.minimum_square_feet ? options.minimum_square_feet : '' } ref="minimum_square_feet" type="text" placeholder="Min"/>
                </div>
                <div style={ S('w-50p pull-left') }>
                  <Input defaultValue={ options && options.maximum_square_feet ? options.maximum_square_feet : '' } ref="maximum_square_feet" type="text" placeholder="Max"/>
                </div>
              </div>
            </div>
            <div style={ S('p-15') }>
              <div>
                Pool
              </div>
              <Button style={ S('mr-10') } bsStyle={ this.buttonIsActive('pool', true) ? 'primary' : 'default' } onClick={ this.props.handleFilterButton.bind(this, { key: 'pool', value: true }) }>Yes</Button>
              <Button style={ S('mr-10') } bsStyle={ this.buttonIsActive('pool', false) ? 'primary' : 'default' } onClick={ this.props.handleFilterButton.bind(this, { key: 'pool', value: false }) }>No</Button>
              <Button style={ S('mr-10') } bsStyle={ this.buttonIsActive('pool', 'either') ? 'primary' : 'default' } onClick={ this.props.handleFilterButton.bind(this, { key: 'pool', value: 'either' }) }>Either</Button>
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
  setFilterOptions: React.PropTypes.func
}