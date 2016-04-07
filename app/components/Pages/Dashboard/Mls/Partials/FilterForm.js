// Partials/FilterForm.js
import React, { Component } from 'react'
import { Button, Input } from 'react-bootstrap'
import S from 'shorti'
import Switch from 'react-ios-switch'
import helpers from '../../../../../utils/helpers'
import DayPicker, { DateUtils } from 'react-day-picker'
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
  handleSetSoldDate(e, day) {
    if (DateUtils.isPastDay(day))
      this.props.handleSetSoldDate(day)
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
    let filter_options = {}
    if (data.listing_map) {
      const listing_map = data.listing_map
      if (listing_map.filter_options)
        filter_options = data.listing_map.filter_options
    }
    const status_style = {
      ...S('border-bottom-1-solid-f3f6f7'),
      overflow: 'hidden'
    }
    let sold_options = []
    let active_options = []
    let other_options = []
    if (filter_options.status_options && filter_options.status_options.sold)
      sold_options = filter_options.status_options.sold
    if (filter_options.status_options && filter_options.status_options.active)
      active_options = filter_options.status_options.active
    if (filter_options.status_options && filter_options.status_options.other)
      other_options = filter_options.status_options.other
    const sold_date = filter_options.sold_date
    const date_obj = new Date(sold_date * 1000)
    let sold_date_picker
    if (filter_options.show_sold_date_picker) {
      sold_date_picker = (
        <div style={ S('absolute z-100 l-105 t-110 border-1-solid-ccc bg-fff br-3') }>
          <DayPicker
            modifiers={{
              selected: day => DateUtils.isSameDay(date_obj, day),
              disabled: day => { return !DateUtils.isPastDay(day) }
            }}
            onDayClick={ this.handleSetSoldDate.bind(this) }
          />
        </div>
      )
    }
    let sold_date_picker_text = 'Pick a date'
    if (filter_options.sold_date) {
      const friendly_sold_date = helpers.friendlyDate(filter_options.sold_date)
      sold_date_picker_text = `${friendly_sold_date.date} ${friendly_sold_date.month}`
    }
    return (
      <div className={ filter_form_class } style={ filter_form_style }>
        <form onSubmit={ this.props.setFilterOptions.bind(this) }>
          <div style={ filter_scroll_area_style }>
            <div style={ status_style }>
              <div
                onClick={ this.props.toggleListingStatusDropdown.bind(this, 'sold') }
                style={ S('pull-left w-200 pt-15 pl-15 pb-15 pointer h-50') }
              >
                <span style={ S('color-db3821 font-30 mr-12 relative t-12n') }>&#8226;</span>
                <span style={ S('relative t-15n') }>Sold</span>
                <i style={ S('pull-right font-20') } className={ `fa fa-caret-${filter_options.status_dropdowns && filter_options.status_dropdowns.sold ? `up` : 'down'}` }></i>
              </div>
              <div style={ S('pull-right w-95 pt-15 pr-15 pb-15') }>
                <div style={ S('pull-left') }>
                  <span style={ S('color-dcdedf relative ml-15') }>|</span>
                </div>
                <div style={ S('pull-right') }>
                  <Switch checked={ filter_options ? filter_options.sold : false } onChange={ this.props.handleFilterSwitch.bind(this, 'sold') } />
                </div>
              </div>
              <div className="clearfix"></div>
              <div style={ S(`bg-f8fafb ${filter_options.status_dropdowns && filter_options.status_dropdowns.sold ? `p-15 border-top-1-solid-f3f6f7` : 'h-0'}`) }>
                <Button style={ S(`${sold_options.indexOf(3) !== -1 ? 'color-fff bg-667688 border-1-solid-667688' : ''}`) } onClick={ this.props.handleFilterStatusOptionSelect.bind(this, 'sold', 3) }>3 Mo</Button>
                <Button style={ S(`${sold_options.indexOf(6) !== -1 ? 'color-fff bg-667688 border-1-solid-667688' : ''}`) } onClick={ this.props.handleFilterStatusOptionSelect.bind(this, 'sold', 6) }>6 Mo</Button>
                <Button style={ S(`${sold_options.indexOf(12) !== -1 ? 'color-fff bg-667688 border-1-solid-667688' : ''}`) } onClick={ this.props.handleFilterStatusOptionSelect.bind(this, 'sold', 12) }>12 Mo</Button>
                <Button style={ S(`${filter_options.show_sold_date_picker || filter_options.sold_date ? 'color-fff bg-667688 border-1-solid-667688' : ''}`) } onClick={ this.props.showSoldDatePicker.bind(this) }>{ sold_date_picker_text }</Button>
                { sold_date_picker }
              </div>
              <div className="clearfix"></div>
            </div>
            <div style={ status_style }>
              <div
                onClick={ this.props.toggleListingStatusDropdown.bind(this, 'active') }
                style={ S('pull-left w-200 pt-15 pl-15 pb-15 pointer h-50') }
              >
                <span style={ S('color-82dd00 font-30 mr-12 relative t-12n') }>&#8226;</span>
                <span style={ S('relative t-15n') }>Active</span>
                <i style={ S('pull-right font-20') } className={ `fa fa-caret-${filter_options.status_dropdowns && filter_options.status_dropdowns.active ? `up` : 'down'}` }></i>
              </div>
              <div style={ S('pull-right w-95 pt-15 pr-15 pb-15') }>
                <div style={ S('pull-left') }>
                  <span style={ S('color-dcdedf relative ml-15') }>|</span>
                </div>
                <div style={ S('pull-right') }>
                  <Switch checked={ filter_options ? filter_options.active : false } onChange={ this.props.handleFilterSwitch.bind(this, 'active') } />
                </div>
              </div>
              <div className="clearfix"></div>
              <div style={ S(`bg-f8fafb ${filter_options.status_dropdowns && filter_options.status_dropdowns.active ? `border-top-1-solid-f3f6f7 p-15` : 'h-0'}`) }>
                <div style={ S('pointer relative') } onClick={ this.props.handleFilterStatusOptionSelect.bind(this, 'active', 'Active') }>
                  <div style={ S('absolute') }><i className={ `fa fa-check ${active_options.indexOf('Active') !== -1 ? 'text-primary' : 'hidden'}`}></i></div>
                    <div style={ S('ml-20') }>Active</div>
                </div>
                <div style={ S('pointer relative') } onClick={ this.props.handleFilterStatusOptionSelect.bind(this, 'active', 'Active Contingent') }>
                  <div style={ S('absolute') }><i className={ `fa fa-check ${active_options.indexOf('Active Contingent') !== -1 ? 'text-primary' : 'hidden'}`}></i></div>
                    <div style={ S('ml-20') }>Active Contingent</div>
                </div>
                <div style={ S('pointer relative') } onClick={ this.props.handleFilterStatusOptionSelect.bind(this, 'active', 'Active Kick Out') }>
                  <div style={ S('absolute') }><i className={ `fa fa-check ${active_options.indexOf('Active Kick Out') !== -1 ? 'text-primary' : 'hidden'}`}></i></div>
                    <div style={ S('ml-20') }>Active Kick Out</div>
                </div>
                <div style={ S('pointer relative') } onClick={ this.props.handleFilterStatusOptionSelect.bind(this, 'active', 'Active Option Contract') }>
                  <div style={ S('absolute') }><i className={ `fa fa-check ${active_options.indexOf('Active Option Contract') !== -1 ? 'text-primary' : 'hidden'}`}></i></div>
                    <div style={ S('ml-20') }>Active Option Contract</div>
                </div>
              </div>
              <div className="clearfix"></div>
            </div>
            <div style={ status_style }>
              <div
                onClick={ this.props.toggleListingStatusDropdown.bind(this, 'other') }
                style={ S('pull-left w-200 pt-15 pl-15 pb-15 pointer h-50') }
              >
                <span style={ S('color-f8b619 font-30 mr-12 relative t-12n') }>&#8226;</span>
                <span style={ S('relative t-15n') }>Other Listing Status</span>
                <i style={ S('pull-right font-20') } className={ `fa fa-caret-${filter_options.status_dropdowns && filter_options.status_dropdowns.other ? `up` : 'down'}` }></i>
              </div>
              <div style={ S('pull-right w-95 pt-15 pr-15 pb-15') }>
                <div style={ S('pull-left') }>
                  <span style={ S('color-dcdedf relative ml-15') }>|</span>
                </div>
                <div style={ S('pull-right') }>
                  <Switch checked={ filter_options ? filter_options.other : false } onChange={ this.props.handleFilterSwitch.bind(this, 'other') } />
                </div>
              </div>
              <div className="clearfix"></div>
              <div style={ S(`bg-f8fafb ${filter_options.status_dropdowns && filter_options.status_dropdowns.other ? `border-top-1-solid-f3f6f7 p-15` : 'h-0'}`) }>
                <div style={ S('pointer relative') } onClick={ this.props.handleFilterStatusOptionSelect.bind(this, 'other', 'Cancelled') }>
                  <div style={ S('absolute') }><i className={ `fa fa-check ${other_options.indexOf('Cancelled') !== -1 ? 'text-primary' : 'hidden'}`}></i></div>
                    <div style={ S('ml-20') }>Cancelled</div>
                </div>
                <div style={ S('pointer relative') } onClick={ this.props.handleFilterStatusOptionSelect.bind(this, 'other', 'Expired') }>
                  <div style={ S('absolute') }><i className={ `fa fa-check ${other_options.indexOf('Expired') !== -1 ? 'text-primary' : 'hidden'}`}></i></div>
                    <div style={ S('ml-20') }>Expired</div>
                </div>
                <div style={ S('pointer relative') } onClick={ this.props.handleFilterStatusOptionSelect.bind(this, 'other', 'Pending') }>
                  <div style={ S('absolute') }><i className={ `fa fa-check ${other_options.indexOf('Pending') !== -1 ? 'text-primary' : 'hidden'}`}></i></div>
                    <div style={ S('ml-20') }>Pending</div>
                </div>
                <div style={ S('pointer relative') } onClick={ this.props.handleFilterStatusOptionSelect.bind(this, 'other', 'Temp Off Market') }>
                  <div style={ S('absolute') }><i className={ `fa fa-check ${other_options.indexOf('Temp Off Market') !== -1 ? 'text-primary' : 'hidden'}`}></i></div>
                    <div style={ S('ml-20') }>Temp Off Market</div>
                </div>
                <div style={ S('pointer relative') } onClick={ this.props.handleFilterStatusOptionSelect.bind(this, 'other', 'Withdrawn') }>
                  <div style={ S('absolute') }><i className={ `fa fa-check ${other_options.indexOf('Withdrawn') !== -1 ? 'text-primary' : 'hidden'}`}></i></div>
                    <div style={ S('ml-20') }>Withdrawn</div>
                </div>
                <div style={ S('pointer relative') } onClick={ this.props.handleFilterStatusOptionSelect.bind(this, 'other', 'Withdrawn Sublisting') }>
                  <div style={ S('absolute') }><i className={ `fa fa-check ${other_options.indexOf('Withdrawn Sublisting') !== -1 ? 'text-primary' : 'hidden'}`}></i></div>
                    <div style={ S('ml-20') }>Withdrawn Sublisting</div>
                </div>
              </div>
              <div className="clearfix"></div>
            </div>
            <div style={ status_style }>
              <div style={ S('pull-left w-200 pt-15 pl-15 pb-15 h-50') }>
                <span style={ S('color-35b863 font-30 mr-12 relative t-12n') }>&#8226;</span>
                <span style={ S('relative t-15n') }>Open Houses Only</span>
              </div>
              <div style={ S('pull-right w-95 pt-15 pr-15 pb-15') }>
                <div style={ S('pull-left') }>
                  <span style={ S('color-dcdedf relative ml-15') }>|</span>
                </div>
                <div style={ S('pull-right') }>
                  <Switch checked={ filter_options ? filter_options.open_house : false } onChange={ this.props.handleFilterSwitch.bind(this, 'open_house') } />
                </div>
              </div>
              <div className="clearfix"></div>
            </div>
            <div style={ S('pl-15 pt-15 pb-15') }>
              <div style={ S('mb-10') }>Listing Types</div>
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
            <div style={ S('p-15 mb-40') }>
              <div style={ S('mb-10') }>Price Range</div>
              <div>
                <div style={ S('w-50p pull-left') }>
                  <Input onChange={ this.handleOptionChange.bind(this, 'minimum_price') } value={ filter_options && filter_options.minimum_price ? filter_options.minimum_price : '' } ref="minimum_price" type="number" placeholder="Min"/>
                </div>
                <div style={ S('w-50p pull-left') }>
                  <Input onChange={ this.handleOptionChange.bind(this, 'maximum_price') } value={ filter_options && filter_options.maximum_price ? filter_options.maximum_price : '' } ref="maximum_price" type="number" placeholder="Max"/>
                </div>
              </div>
            </div>
            <div style={ S('p-15') }>
              <div style={ S('mb-10') }>
                Bedrooms
              </div>
              <Button bsStyle="default" style={ this.buttonIsActive('minimum_bedrooms', 0) ? S('mr-5 bg-667688 bc-667688 color-fff') : S('mr-5 bg-fff') } onClick={ this.props.handleFilterButton.bind(this, { key: 'minimum_bedrooms', value: 0 }) }>Any</Button>
              { /* <Button bsStyle="default" style={ this.buttonIsActive('minimum_bedrooms', 0) ? S('mr-5 bg-667688 bc-667688 color-fff') : S('mr-5 bg-fff') } onClick={ this.props.handleFilterButton.bind(this, { key: 'minimum_bedrooms', value: 0 }) }>Studio</Button> */ }
              <Button bsStyle="default" style={ this.buttonIsActive('minimum_bedrooms', 1) ? S('mr-5 bg-667688 bc-667688 color-fff') : S('mr-5 bg-fff') } onClick={ this.props.handleFilterButton.bind(this, { key: 'minimum_bedrooms', value: '1' }) }>+1</Button>
              <Button bsStyle="default" style={ this.buttonIsActive('minimum_bedrooms', 2) ? S('mr-5 bg-667688 bc-667688 color-fff') : S('mr-5 bg-fff') } onClick={ this.props.handleFilterButton.bind(this, { key: 'minimum_bedrooms', value: '2' }) }>+2</Button>
              <Button bsStyle="default" style={ this.buttonIsActive('minimum_bedrooms', 3) ? S('mr-5 bg-667688 bc-667688 color-fff') : S('mr-5 bg-fff') } onClick={ this.props.handleFilterButton.bind(this, { key: 'minimum_bedrooms', value: '3' }) }>+3</Button>
            </div>
            <div style={ S('p-15') }>
              <div style={ S('mb-10') }>
                Bathrooms
              </div>
              <Button bsStyle="default" style={ this.buttonIsActive('minimum_bathrooms', 1) ? S('mr-10 bg-667688 bc-667688 color-fff') : S('mr-10 bg-fff') } onClick={ this.props.handleFilterButton.bind(this, { key: 'minimum_bathrooms', value: '1' }) }>+1</Button>
              <Button bsStyle="default" style={ this.buttonIsActive('minimum_bathrooms', 2) ? S('mr-10 bg-667688 bc-667688 color-fff') : S('mr-10 bg-fff') } onClick={ this.props.handleFilterButton.bind(this, { key: 'minimum_bathrooms', value: '2' }) }>+2</Button>
              <Button bsStyle="default" style={ this.buttonIsActive('minimum_bathrooms', 3) ? S('mr-10 bg-667688 bc-667688 color-fff') : S('mr-10 bg-fff') } onClick={ this.props.handleFilterButton.bind(this, { key: 'minimum_bathrooms', value: '3' }) }>+3</Button>
              <Button bsStyle="default" style={ this.buttonIsActive('minimum_bathrooms', 4) ? S('mr-10 bg-667688 bc-667688 color-fff') : S('mr-10 bg-fff') } onClick={ this.props.handleFilterButton.bind(this, { key: 'minimum_bathrooms', value: '4' }) }>+4</Button>
            </div>
            <div style={ S('p-15') }>
              <div style={ S('mb-10') }>Square Footage</div>
              <div>
                <div style={ S('w-50p pull-left') }>
                  <Input onChange={ this.handleOptionChange.bind(this, 'minimum_square_feet') } value={ filter_options && filter_options.minimum_square_feet ? filter_options.minimum_square_feet : '' } ref="minimum_square_feet" type="number" placeholder="Min"/>
                </div>
                <div style={ S('w-50p pull-left') }>
                  <Input onChange={ this.handleOptionChange.bind(this, 'maximum_square_feet') } value={ filter_options && filter_options.maximum_square_feet ? filter_options.maximum_square_feet : '' } ref="maximum_square_feet" type="number" placeholder="Max"/>
                </div>
              </div>
            </div>
            <div style={ S('p-15') }>
              <div style={ S('mb-10') }>
                Pool
              </div>
              <Button bsStyle="default" style={ this.buttonIsActive('pool', true) ? S('mr-10 bg-667688 bc-667688 color-fff') : S('mr-10 bg-fff') } onClick={ this.props.handleFilterButton.bind(this, { key: 'pool', value: true }) }>Yes</Button>
              <Button bsStyle="default" style={ this.buttonIsActive('pool', false) ? S('mr-10 bg-667688 bc-667688 color-fff') : S('mr-10 bg-fff') } onClick={ this.props.handleFilterButton.bind(this, { key: 'pool', value: false }) }>No</Button>
              <Button bsStyle="default" style={ this.buttonIsActive('pool', 'either') ? S('mr-10 bg-667688 bc-667688 color-fff') : S('mr-10 bg-fff') } onClick={ this.props.handleFilterButton.bind(this, { key: 'pool', value: 'either' }) }>Either</Button>
            </div>
            <div style={ S('p-15') }>
              <div style={ S('mb-10') }>Lot Square Footage</div>
              <div>
                <div style={ S('w-50p pull-left') }>
                  <Input onChange={ this.handleOptionChange.bind(this, 'minimum_lot_square_feet') } value={ filter_options && filter_options.minimum_lot_square_feet ? filter_options.minimum_lot_square_feet : '' } ref="minimum_lot_square_feet" type="number" placeholder="Min"/>
                </div>
                <div style={ S('w-50p pull-left') }>
                  <Input onChange={ this.handleOptionChange.bind(this, 'maximum_lot_square_feet') } value={ filter_options && filter_options.maximum_lot_square_feet ? filter_options.maximum_lot_square_feet : '' } ref="maximum_lot_square_feet" type="number" placeholder="Max"/>
                </div>
              </div>
            </div>
            <div style={ S('p-15') }>
              <div style={ S('mb-10') }>Year Built</div>
              <div>
                <div style={ S('w-50p pull-left') }>
                  <Input onChange={ this.handleOptionChange.bind(this, 'minimum_year_built') } value={ filter_options && filter_options.minimum_year_built ? filter_options.minimum_year_built : '' } ref="minimum_year_built" type="number" placeholder="Min"/>
                </div>
                <div style={ S('w-50p pull-left') }>
                  <Input onChange={ this.handleOptionChange.bind(this, 'maximum_year_built') } value={ filter_options && filter_options.maximum_year_built ? filter_options.maximum_year_built : '' } ref="maximum_year_built" type="number" placeholder="Max"/>
                </div>
              </div>
            </div>
            <div style={ S('h-100') }></div>
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
FilterForm.propTypes = {
  data: React.PropTypes.object,
  handleFilterSwitch: React.PropTypes.func,
  handleFilterButton: React.PropTypes.func,
  resetFilterOptions: React.PropTypes.func,
  setFilterOptions: React.PropTypes.func,
  handleOptionChange: React.PropTypes.func,
  toggleListingStatusDropdown: React.PropTypes.func,
  handleFilterStatusOptionSelect: React.PropTypes.func,
  showSoldDatePicker: React.PropTypes.func,
  handleSetSoldDate: React.PropTypes.func
}