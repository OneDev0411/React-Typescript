// Partials/FilterForm.js
import React, { Component } from 'react'
import { ButtonGroup, Button, FormControl } from 'react-bootstrap'
import S from 'shorti'
import Switch from 'react-ios-switch'
import helpers from '../../../../../utils/helpers'
import DayPicker, { DateUtils } from 'react-day-picker'
import Select from 'react-select'
import home_styles_select_options from '../../../../../utils/home-style-data'
import Brand from '../../../../../controllers/Brand'

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
    const value = this[`${key}Input`].value
    this.props.handleOptionChange(key, value)
  }
  handleSetSoldDate(e, day) {
    if (DateUtils.isPastDay(day))
      this.props.handleSetSoldDate(day)
  }
  // Areas
  handleAreaSelectChange(areas) {
    this.props.changeAreasSelected(areas)
  }
  handleAreaInputChange() {
    const data = this.props.data
    if (!data.listing_map.areas)
      this.props.showAreasList()
  }
  // Counties
  handleCountiesSelectChange(counties) {
    this.props.changeCountiesSelected(counties)
  }
  handleCountiesInputChange() {
    const data = this.props.data
    if (!data.listing_map.counties)
      this.props.showCountiesList()
  }
  handleSubAreaSelectChange(sub_areas) {
    this.props.changeSubAreasSelected(sub_areas)
  }
  handleSchoolDistrictsInputChange() {
    const data = this.props.data
    if (!data.listing_map.school_districts)
      this.props.showSchoolDistrictsList()
  }
  handleSchoolDistrictsSelectChange(school_districts) {
    this.props.changeSchoolDistrictsSelected(school_districts)
  }
  handleSchoolSelectChange(school_type, schools) {
    this.props.changeSchoolsSelected(school_type, schools)
  }
  handleHomeStylesSelectChange(value) {
    this.props.changeHomeStylesSelected(value)
  }
  handleSubdivisionsInputChange(value) {
    this.props.showSubdivisionsList(value)
  }
  handleSubdivisionsSelectChange(subdivisions) {
    this.props.changeSubdivisionsSelected(subdivisions)
  }
  render() {
    const data = this.props.data
    const filter_scroll_area_style = {
      ...S('h-' + (window.innerHeight - 97)),
      overflowY: 'scroll'
    }
    let filter_form_class = 'listing-map__filter-form'
    if (data.show_filter_form)
      filter_form_class += ' active' + (!data.user ? '--non-logged-in' : '')
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
    let filter_form_style = S('w-300 absolute z-2 bg-fff t-66 font-15 pb-100 h-' + (window.innerHeight - 66))
    if (data.is_mobile) {
      filter_form_style = {
        ...filter_form_style,
        ...S('t-49 r-0 z-100 h-' + (window.innerHeight - 49))
      }
      if (data.show_filter_form)
        filter_form_class = ''
    }
    if (data.is_widget) {
      filter_form_style = {
        ...filter_form_style,
        ...S('t-0 h-100p')
      }
      if (data.show_filter_form) {
        filter_form_style = {
          ...filter_form_style,
          ...S('l-0')
        }
      }
    }
    // Schools
    let school_districts_select_options
    if (data.listing_map && data.listing_map.show_school_districts_list && data.listing_map.school_districts) {
      school_districts_select_options = data.listing_map.school_districts.map(school_district => {
        return {
          value: school_district.district,
          label: school_district.district
        }
      })
    }
    let elementary_school_select_options
    if (data.listing_map && data.listing_map.show_schools_list && data.listing_map.elementary_schools) {
      elementary_school_select_options = data.listing_map.elementary_schools.map(school => {
        return {
          value: school.name,
          label: school.name
        }
      })
    }
    let middle_school_select_options
    if (data.listing_map && data.listing_map.show_schools_list && data.listing_map.middle_schools) {
      middle_school_select_options = data.listing_map.middle_schools.map(school => {
        return {
          value: school.name,
          label: school.name
        }
      })
    }
    let high_schools_select_options
    if (data.listing_map && data.listing_map.show_schools_list && data.listing_map.high_schools) {
      high_schools_select_options = data.listing_map.high_schools.map(school => {
        const type = school.school_type === 'senior_high_school' ? 'Senior' : 'Junior'
        return {
          value: school.name,
          label: school.name + ' (' + type + ')'
        }
      })
    }
    let intermediate_schools_select_options
    if (data.listing_map && data.listing_map.show_schools_list && data.listing_map.intermediate_schools) {
      intermediate_schools_select_options = data.listing_map.intermediate_schools.map(school => {
        return {
          value: school.name,
          label: school.name
        }
      })
    }
    let schools_area
    if (data.listing_map && data.listing_map.school_districts_selected) {
      schools_area = (
        <div>
          <div style={ S('p-15 relative') }>
            <div style={ S('mb-10') }>Elementary Schools</div>
            <div style={ S('relative') }>
              <Select
                name="elementary_schools"
                options={ elementary_school_select_options }
                placeholder={ elementary_school_select_options && !elementary_school_select_options.length ? 'No schools found' : 'Elementary Schools' }
                onChange={ this.handleSchoolSelectChange.bind(this, 'elementary_school') }
                value={ data.listing_map ? data.listing_map.elementary_schools_selected : '' }
                multi
                noResultsText={ 'No schools found'}
              />
            </div>
          </div>
          <div style={ S('p-15 relative') }>
            <div style={ S('mb-10') }>Middle Schools</div>
            <div style={ S('relative') }>
              <Select
                name="middle_schools"
                options={ middle_school_select_options }
                placeholder={ middle_school_select_options && !middle_school_select_options.length ? 'No schools found' : 'Middle Schools' }
                onChange={ this.handleSchoolSelectChange.bind(this, 'middle_school') }
                value={ data.listing_map ? data.listing_map.middle_schools_selected : '' }
                multi
                noResultsText={ 'No schools found'}
              />
            </div>
          </div>
          <div style={ S('p-15 relative') }>
            <div style={ S('mb-10') }>Intermediate</div>
            <div style={ S('relative') }>
              <Select
                name="intermediate_schools"
                options={ intermediate_schools_select_options }
                placeholder={ intermediate_schools_select_options && !intermediate_schools_select_options.length ? 'No schools found' : 'Intermediate Schools' }
                onChange={ this.handleSchoolSelectChange.bind(this, 'intermediate_school') }
                value={ data.listing_map ? data.listing_map.intermediate_schools_selected : '' }
                multi
                noResultsText={ 'No schools found'}
              />
            </div>
          </div>
          <div style={ S('p-15 relative') }>
            <div style={ S('mb-10') }>High Schools</div>
            <div style={ S('relative') }>
              <Select
                name="high_schools"
                options={ high_schools_select_options }
                placeholder={ high_schools_select_options && !high_schools_select_options.length ? 'No schools found' : 'High Schools' }
                onChange={ this.handleSchoolSelectChange.bind(this, 'high_school') }
                value={ data.listing_map ? data.listing_map.high_schools_selected : '' }
                multi
                noResultsText={ 'No schools found'}
              />
            </div>
          </div>
        </div>
      )
    }
    // Areas
    let area_select_options
    if (data.listing_map && data.listing_map.show_areas_list && data.listing_map.areas) {
      area_select_options = data.listing_map.areas.map(area => {
        return {
          value: area.number,
          label: area.number + ' ' + area.title
        }
      })
    }
    // Sub Areas
    let sub_area_select_options
    if (data.listing_map && data.listing_map.show_areas_list && data.listing_map.sub_areas) {
      sub_area_select_options = data.listing_map.sub_areas.map(sub_area => {
        return {
          value: sub_area.number,
          label: sub_area.number + ' ' + sub_area.title,
          parent: sub_area.parent
        }
      })
    }
    let sub_areas_area
    if (data.listing_map && data.listing_map.areas_selected) {
      sub_areas_area = (
        <div style={ S('p-15 relative') }>
          <div style={ S('relative') }>
            <Select
              name="sub_areas"
              options={ sub_area_select_options }
              onChange={ this.handleSubAreaSelectChange.bind(this) }
              placeholder="Sub area #..."
              multi
              value={ data.listing_map ? data.listing_map.sub_areas_selected : '' }
            />
          </div>
        </div>
      )
    }
    // Counties
    let counties_select_options
    if (data.listing_map && data.listing_map.show_counties_list && data.listing_map.counties) {
      counties_select_options = data.listing_map.counties.map(county => {
        return {
          value: county.title,
          label: county.title
        }
      })
    }
    // Subdivisions
    let subdivisions_select_options
    if (data.listing_map && data.listing_map.subdivisions) {
      subdivisions_select_options = data.listing_map.subdivisions.map(subdivision => {
        return {
          value: subdivision.title,
          label: subdivision.title
        }
      })
    }
    let areas_area
    if (data.user && data.user.user_type === 'Agent') {
      areas_area = (
        <div>
          <div style={ S('p-15 pb-0 relative') }>
            <div style={ S('mb-10') }>MLS Areas</div>
            <div style={ S('relative') }>
              <Select
                name="areas"
                options={ area_select_options }
                onInputChange={ this.handleAreaInputChange.bind(this) }
                onOpen={ this.handleAreaInputChange.bind(this) }
                onChange={ this.handleAreaSelectChange.bind(this) }
                placeholder="Area #..."
                multi
                value={ data.listing_map ? data.listing_map.areas_selected : '' }
              />
            </div>
          </div>
          { sub_areas_area }
        </div>
      )
    }
    return (
      <div className={ filter_form_class } style={ filter_form_style }>
        <div id="close_filters" className={ data.is_mobile ? 'hidden' : '' } onClick={ this.props.hideFilterForm } style={ S('r-45n t-10 absolute bg-fff w-45 h-45 z-100 text-center font-28 pointer color-929292') }>
          &times;
        </div>
        <form onSubmit={ this.props.setFilterOptions.bind(this) }>
          <div style={ filter_scroll_area_style }>
            <div style={ status_style }>
              <div
                onClick={ this.props.toggleListingStatusDropdown.bind(this, 'sold') }
                style={ S('pull-left w-180 pt-15 pl-15 pb-15 pointer h-50') }
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
                  <Switch checked={ filter_options && filter_options.sold ? filter_options.sold : false } onChange={ this.props.handleFilterSwitch.bind(this, 'sold') } />
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
                style={ S('pull-left w-180 pt-15 pl-15 pb-15 pointer h-50') }
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
                  <Switch
                    checked={ filter_options && filter_options.active ? filter_options.active : false }
                    onChange={ this.props.handleFilterSwitch.bind(this, 'active') }
                  />
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
                style={ S('pull-left w-180 pt-15 pl-15 pb-15 pointer h-50') }
              >
                <span style={ S('color-f8b619 font-30 mr-12 relative t-12n') }>&#8226;</span>
                <span style={ S('relative t-15n') }>Other Status</span>
                <i style={ S('pull-right font-20') } className={ `fa fa-caret-${filter_options.status_dropdowns && filter_options.status_dropdowns.other ? `up` : 'down'}` }></i>
              </div>
              <div style={ S('pull-right w-95 pt-15 pr-15 pb-15') }>
                <div style={ S('pull-left') }>
                  <span style={ S('color-dcdedf relative ml-15') }>|</span>
                </div>
                <div style={ S('pull-right') }>
                  <Switch checked={ filter_options && filter_options.other ? filter_options.other : false } onChange={ this.props.handleFilterSwitch.bind(this, 'other') } />
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
              <div style={ S('pull-left w-180 pt-15 pl-15 pb-15 h-50') }>
                <span style={ S('color-35b863 font-30 mr-12 relative t-12n') }>&#8226;</span>
                <span style={ S('relative t-15n') }>Open Houses Only</span>
              </div>
              <div style={ S('pull-right w-95 pt-15 pr-15 pb-15') }>
                <div style={ S('pull-left') }>
                  <span style={ S('color-dcdedf relative ml-15') }>|</span>
                </div>
                <div style={ S('pull-right') }>
                  <Switch checked={ filter_options && filter_options.open_house ? filter_options.open_house : false } onChange={ this.props.handleFilterSwitch.bind(this, 'open_house') } />
                </div>
              </div>
              <div className="clearfix"></div>
            </div>
            { areas_area }
            <div style={ S('p-15 relative') }>
              <div style={ S('mb-10') }>County</div>
              <div style={ S('relative') }>
                <Select
                  name="county"
                  options={ counties_select_options }
                  onInputChange={ this.handleCountiesInputChange.bind(this) }
                  onOpen={ this.handleCountiesInputChange.bind(this) }
                  onChange={ this.handleCountiesSelectChange.bind(this) }
                  placeholder="Type in county name..."
                  multi
                  value={ data.listing_map ? data.listing_map.counties_selected : '' }
                />
              </div>
            </div>
            <div style={ S('p-15 mb-40') }>
              <div style={ S('mb-10') }>Price Range</div>
              <div>
                <div style={ S('w-50p pull-left') }>
                  <FormControl onChange={ this.handleOptionChange.bind(this, 'minimum_price') } value={ filter_options && filter_options.minimum_price ? filter_options.minimum_price : '' } inputRef={ ref => this.minimum_priceInput = ref } type="number" placeholder="Min"/>
                </div>
                <div style={ S('w-50p pull-left') }>
                  <FormControl onChange={ this.handleOptionChange.bind(this, 'maximum_price') } value={ filter_options && filter_options.maximum_price ? filter_options.maximum_price : '' } inputRef={ ref => this.maximum_priceInput = ref } type="number" placeholder="Max"/>
                </div>
              </div>
            </div>
            <div style={ S('pl-15 pt-15 pb-15') }>
              <div style={ S('mb-10') }>Property Types</div>
              <ButtonGroup style={ S('w-100p') }>
                <Button bsStyle="default" style={ this.buttonIsActive('listing_types', 'any') ? S('h-80 w-24p bg-667688 bc-667688') : S('h-80 w-24p bg-fff') } onClick={ this.props.handleFilterButton.bind(this, { key: 'listing_types', value: 'any' }) }>
                  <div style={ S('mb-10') }>
                    <img src={`/static/images/dashboard/mls/listing-types/any${this.buttonIsActive('listing_types', 'any') ? '-active' : ''}.svg`}/>
                  </div>
                  <span style={ S(`font-10 color-${this.buttonIsActive('listing_types', 'any') ? 'fff' : '929292'}`) }>Any</span>
                </Button>
                <Button bsStyle="default" style={ this.buttonIsActive('listing_types', 'house') ? S('h-80 w-24p bg-667688 bc-667688') : S('h-80 w-24p bg-fff') } onClick={ this.props.handleFilterButton.bind(this, { key: 'listing_types', value: 'house' }) }>
                  <div style={ S('mb-10') }>
                    <img src={`/static/images/dashboard/mls/listing-types/house${this.buttonIsActive('listing_types', 'house') ? '-active' : ''}.svg`}/>
                  </div>
                  <span style={ S(`font-10 color-${this.buttonIsActive('listing_types', 'house') ? 'fff' : '929292'}`) }>House</span>
                </Button>
                <Button bsStyle="default" style={ this.buttonIsActive('listing_types', 'condo') ? S('h-80 w-24p bg-667688 bc-667688') : S('h-80 w-24p bg-fff') } onClick={ this.props.handleFilterButton.bind(this, { key: 'listing_types', value: 'condo' }) }>
                  <div style={ S('mb-10') }>
                    <img src={`/static/images/dashboard/mls/listing-types/condo${this.buttonIsActive('listing_types', 'condo') ? '-active' : ''}.svg`}/>
                  </div>
                  <span style={ S(`font-10 color-${this.buttonIsActive('listing_types', 'condo') ? 'fff' : '929292'}`) }>Condo</span>
                </Button>
                <Button bsStyle="default" style={ this.buttonIsActive('listing_types', 'townhouse') ? S('h-80 w-24p bg-667688 bc-667688') : S('h-80 w-24p bg-fff') } onClick={ this.props.handleFilterButton.bind(this, { key: 'listing_types', value: 'townhouse' }) }>
                  <div style={ S('mb-10') }>
                    <img src={`/static/images/dashboard/mls/listing-types/townhouse${this.buttonIsActive('listing_types', 'townhouse') ? '-active' : ''}.svg`}/>
                  </div>
                  <span style={ S(`font-10 color-${this.buttonIsActive('listing_types', 'townhouse') ? 'fff' : '929292'}`) }>Townhouse</span>
                </Button>
              </ButtonGroup>
            </div>
            <div style={ S('p-15 relative') }>
              <div style={ S('mb-10') }>Style of Home</div>
              <div style={ S('relative') }>
                <Select
                  name="home_styles"
                  options={ home_styles_select_options }
                  onChange={ this.handleHomeStylesSelectChange.bind(this) }
                  placeholder="Home Styles"
                  multi
                  value={ data.listing_map ? data.listing_map.home_styles_selected : '' }
                />
              </div>
            </div>
            <div style={ S('p-15') }>
              <div style={ S('mb-10') }>
                Bedrooms
              </div>
              <ButtonGroup>
                <Button bsStyle="default" style={ this.buttonIsActive('minimum_bedrooms', 0) ? S('bg-667688 bc-667688 color-fff') : S('bg-fff') } onClick={ this.props.handleFilterButton.bind(this, { key: 'minimum_bedrooms', value: 0 }) }>Any</Button>
                <Button bsStyle="default" style={ this.buttonIsActive('minimum_bedrooms', 1) ? S('bg-667688 bc-667688 color-fff') : S('bg-fff') } onClick={ this.props.handleFilterButton.bind(this, { key: 'minimum_bedrooms', value: '1' }) }>1+</Button>
                <Button bsStyle="default" style={ this.buttonIsActive('minimum_bedrooms', 2) ? S('bg-667688 bc-667688 color-fff') : S('bg-fff') } onClick={ this.props.handleFilterButton.bind(this, { key: 'minimum_bedrooms', value: '2' }) }>2+</Button>
                <Button bsStyle="default" style={ this.buttonIsActive('minimum_bedrooms', 3) ? S('bg-667688 bc-667688 color-fff') : S('bg-fff') } onClick={ this.props.handleFilterButton.bind(this, { key: 'minimum_bedrooms', value: '3' }) }>3+</Button>
                <Button bsStyle="default" style={ this.buttonIsActive('minimum_bedrooms', 4) ? S('bg-667688 bc-667688 color-fff') : S('bg-fff') } onClick={ this.props.handleFilterButton.bind(this, { key: 'minimum_bedrooms', value: '4' }) }>4+</Button>
                <Button bsStyle="default" style={ this.buttonIsActive('minimum_bedrooms', 5) ? S('bg-667688 bc-667688 color-fff') : S('bg-fff') } onClick={ this.props.handleFilterButton.bind(this, { key: 'minimum_bedrooms', value: '5' }) }>5+</Button>
              </ButtonGroup>
            </div>
            <div style={ S('p-15') }>
              <div style={ S('mb-10') }>
                Bathrooms
              </div>
              <ButtonGroup>
                <Button bsStyle="default" style={ this.buttonIsActive('minimum_bathrooms', 0) ? S('bg-667688 bc-667688 color-fff') : S('bg-fff') } onClick={ this.props.handleFilterButton.bind(this, { key: 'minimum_bathrooms', value: 0 }) }>Any</Button>
                <Button bsStyle="default" style={ this.buttonIsActive('minimum_bathrooms', 1) ? S('bg-667688 bc-667688 color-fff') : S('bg-fff') } onClick={ this.props.handleFilterButton.bind(this, { key: 'minimum_bathrooms', value: '1' }) }>1+</Button>
                <Button bsStyle="default" style={ this.buttonIsActive('minimum_bathrooms', 2) ? S('bg-667688 bc-667688 color-fff') : S('bg-fff') } onClick={ this.props.handleFilterButton.bind(this, { key: 'minimum_bathrooms', value: '2' }) }>2+</Button>
                <Button bsStyle="default" style={ this.buttonIsActive('minimum_bathrooms', 3) ? S('bg-667688 bc-667688 color-fff') : S('bg-fff') } onClick={ this.props.handleFilterButton.bind(this, { key: 'minimum_bathrooms', value: '3' }) }>3+</Button>
                <Button bsStyle="default" style={ this.buttonIsActive('minimum_bathrooms', 4) ? S('bg-667688 bc-667688 color-fff') : S('bg-fff') } onClick={ this.props.handleFilterButton.bind(this, { key: 'minimum_bathrooms', value: '4' }) }>4+</Button>
                <Button bsStyle="default" style={ this.buttonIsActive('minimum_bathrooms', 5) ? S('bg-667688 bc-667688 color-fff') : S('bg-fff') } onClick={ this.props.handleFilterButton.bind(this, { key: 'minimum_bathrooms', value: '5' }) }>5+</Button>
              </ButtonGroup>
            </div>
            <div style={ S('p-15 relative') }>
              <div style={ S('mb-10') }>Subdivision</div>
              <div style={ S('relative') }>
                <Select
                  name="subdivisions"
                  options={ subdivisions_select_options }
                  onInputChange={ this.handleSubdivisionsInputChange.bind(this) }
                  onChange={ this.handleSubdivisionsSelectChange.bind(this) }
                  placeholder="Subdivision name..."
                  multi
                  noResultsText={ subdivisions_select_options && !subdivisions_select_options.length ? 'No results found' : false }
                  value={ data.listing_map ? data.listing_map.subdivisions_selected : '' }
                />
              </div>
            </div>
            <div style={ S('p-15 relative') }>
              <div style={ S('mb-10') }>School Districts</div>
              <div style={ S('relative') }>
                <Select
                  name="school_districts"
                  options={ school_districts_select_options }
                  onInputChange={ this.handleSchoolDistrictsInputChange.bind(this) }
                  onOpen={ this.handleSchoolDistrictsInputChange.bind(this) }
                  onChange={ this.handleSchoolDistrictsSelectChange.bind(this) }
                  placeholder="School Districts"
                  multi
                  value={ data.listing_map ? data.listing_map.school_districts_selected : '' }
                />
              </div>
            </div>
            { schools_area }
            <div style={ S('p-15') }>
              <div style={ S('mb-10') }>
                Garage Spaces
              </div>
              <ButtonGroup>
                <Button bsStyle="default" style={ this.buttonIsActive('minimum_parking_spaces', 0) ? S('bg-667688 bc-667688 color-fff') : S('bg-fff') } onClick={ this.props.handleFilterButton.bind(this, { key: 'minimum_parking_spaces', value: 0 }) }>Any</Button>
                <Button bsStyle="default" style={ this.buttonIsActive('minimum_parking_spaces', 1) ? S('bg-667688 bc-667688 color-fff') : S('bg-fff') } onClick={ this.props.handleFilterButton.bind(this, { key: 'minimum_parking_spaces', value: '1' }) }>1+</Button>
                <Button bsStyle="default" style={ this.buttonIsActive('minimum_parking_spaces', 2) ? S('bg-667688 bc-667688 color-fff') : S('bg-fff') } onClick={ this.props.handleFilterButton.bind(this, { key: 'minimum_parking_spaces', value: '2' }) }>2+</Button>
                <Button bsStyle="default" style={ this.buttonIsActive('minimum_parking_spaces', 3) ? S('bg-667688 bc-667688 color-fff') : S('bg-fff') } onClick={ this.props.handleFilterButton.bind(this, { key: 'minimum_parking_spaces', value: '3' }) }>3+</Button>
                <Button bsStyle="default" style={ this.buttonIsActive('minimum_parking_spaces', 4) ? S('bg-667688 bc-667688 color-fff') : S('bg-fff') } onClick={ this.props.handleFilterButton.bind(this, { key: 'minimum_parking_spaces', value: '4' }) }>4+</Button>
                <Button bsStyle="default" style={ this.buttonIsActive('minimum_parking_spaces', 5) ? S('bg-667688 bc-667688 color-fff') : S('bg-fff') } onClick={ this.props.handleFilterButton.bind(this, { key: 'minimum_parking_spaces', value: '5' }) }>5+</Button>
              </ButtonGroup>
            </div>
            <div style={ S('p-15') }>
              <div style={ S('mb-10') }>
                Pool
              </div>
              <ButtonGroup style={ S('w-100p') }>
                <Button bsStyle="default" style={ this.buttonIsActive('pool', true) ? S('w-33p bg-667688 bc-667688 color-fff') : S('w-33p bg-fff') } onClick={ this.props.handleFilterButton.bind(this, { key: 'pool', value: true }) }>Yes</Button>
                <Button bsStyle="default" style={ this.buttonIsActive('pool', false) ? S('w-33p bg-667688 bc-667688 color-fff') : S('w-33p bg-fff') } onClick={ this.props.handleFilterButton.bind(this, { key: 'pool', value: false }) }>No</Button>
                <Button bsStyle="default" style={ this.buttonIsActive('pool', 'either') ? S('w-33p bg-667688 bc-667688 color-fff') : S('w-33p bg-fff') } onClick={ this.props.handleFilterButton.bind(this, { key: 'pool', value: 'either' }) }>Either</Button>
              </ButtonGroup>
            </div>
            <div style={ S('p-15') }>
              <div style={ S('mb-10') }>Square Footage</div>
              <div>
                <div style={ S('w-50p pull-left') }>
                  <FormControl onChange={ this.handleOptionChange.bind(this, 'minimum_square_feet') } value={ filter_options && filter_options.minimum_square_feet ? filter_options.minimum_square_feet : '' } inputRef={ ref => this.minimum_square_feetInput = ref } type="number" placeholder="Min"/>
                </div>
                <div style={ S('w-50p pull-left') }>
                  <FormControl onChange={ this.handleOptionChange.bind(this, 'maximum_square_feet') } value={ filter_options && filter_options.maximum_square_feet ? filter_options.maximum_square_feet : '' } inputRef={ ref => this.maximum_square_feetInput = ref } type="number" placeholder="Max"/>
                </div>
              </div>
            </div>
            <div style={ S('p-15') }>
              <div style={ S('mb-10') }>Lot Square Footage</div>
              <div>
                <div style={ S('w-50p pull-left') }>
                  <FormControl onChange={ this.handleOptionChange.bind(this, 'minimum_lot_square_feet') } value={ filter_options && filter_options.minimum_lot_square_feet ? filter_options.minimum_lot_square_feet : '' } inputRef={ ref => this.minimum_lot_square_feetInput = ref } type="number" placeholder="Min"/>
                </div>
                <div style={ S('w-50p pull-left') }>
                  <FormControl onChange={ this.handleOptionChange.bind(this, 'maximum_lot_square_feet') } value={ filter_options && filter_options.maximum_lot_square_feet ? filter_options.maximum_lot_square_feet : '' } inputRef={ ref => this.maximum_lot_square_feetInput = ref } type="number" placeholder="Max"/>
                </div>
              </div>
            </div>
            <div style={ S('p-15') }>
              <div style={ S('mb-10') }>Year Built</div>
              <div>
                <div style={ S('w-50p pull-left') }>
                  <FormControl onChange={ this.handleOptionChange.bind(this, 'minimum_year_built') } value={ filter_options && filter_options.minimum_year_built ? filter_options.minimum_year_built : '' } inputRef={ ref => this.minimum_year_builtInput = ref } type="number" placeholder="Min"/>
                </div>
                <div style={ S('w-50p pull-left') }>
                  <FormControl onChange={ this.handleOptionChange.bind(this, 'maximum_year_built') } value={ filter_options && filter_options.maximum_year_built ? filter_options.maximum_year_built : '' } inputRef={ ref => this.maximum_year_builtInput = ref } type="number" placeholder="Max"/>
                </div>
              </div>
            </div>
            <div style={ S('h-200') }></div>
          </div>
          <div style={ S('absolute b-0 w-300 p-15') }>
            {
              /* <Button onClick={ this.props.resetFilterOptions.bind(this) } style={ { ...S('color-fff bg-c5cdd8 w-50p br-0'), border: 'none' } }>Reset Filter</Button> */
            }
            <Button type="submit" style={ { ...S(`bg-${Brand.color('primary', '3388ff')} w-100p br-3 p-15 color-fff z-100 relative`), border: 'none' } }>Update Filters</Button>
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
  handleSetSoldDate: React.PropTypes.func,
  hideFilterForm: React.PropTypes.func,
  showSchoolDistrictsList: React.PropTypes.func,
  changeSchoolDistrictsSelected: React.PropTypes.func,
  changeSchoolsSelected: React.PropTypes.func,
  showAreasList: React.PropTypes.func,
  changeAreasSelected: React.PropTypes.func,
  changeSubAreasSelected: React.PropTypes.func,
  changeCountiesSelected: React.PropTypes.func,
  showCountiesList: React.PropTypes.func,
  changeHomeStylesSelected: React.PropTypes.func,
  showSubdivisionsList: React.PropTypes.func,
  changeSubdivisionsSelected: React.PropTypes.func
}
