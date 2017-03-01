// Dashboard/Mls/Listing/Recommend.js
import React, { Component } from 'react'
import { Input } from 'react-bootstrap'
import S from 'shorti'

// Partials
import SideBar from '../../../Partials/SideBar'

import Loading from '../../../../../Partials/Loading'

import ListingDispatcher from '../../../../../../dispatcher/ListingDispatcher'
import AppStore from '../../../../../../stores/AppStore'

import listingHelpers from '../../../../../../utils/listing'
import helpers from '../../../../../../utils/helpers'

export default class Recommend extends Component {

  componentDidMount() {
    this.refs.mls_number.refs.input.focus()
  }

  handleSubmit(e) {
    e.preventDefault()
  }

  handleMLSNumberChange(e) {
    const user = this.props.data.user
    const mls_number = e.target.value

    ListingDispatcher.dispatch({
      action: 'get-similar-listings',
      user,
      mls_number
    })
  }

  createRow(listings, formatter) {
    return listings.map(listing => {
      return (
        <td>
          {formatter(listing)}
        </td>
      )
    })
  }

  createTable(listings) {
    const row = this.createRow.bind(null, listings)

    const photo = l => {
      return (
        <img src={l.cover_image_url} width="100" />
      )
    }

    const date = (time) => {
      if (!time)
        return ''

      const d = helpers.friendlyDate(time)
      return d.month + ' ' + d.date + ', ' + d.year
    }

    return (
      <table width="100%">
        <tbody>
          <tr>
            <th></th>
            { row(photo) }
          </tr>

          <tr>
            <th></th>
            {row(l => listingHelpers.localAddress(l.property.address))}
          </tr>

          <tr>
            <th>MLS#</th>
            {row(l => l.mls_number)}
          </tr>

          <tr>
            <th>List Price</th>
            {row(l => '$' + helpers.numberWithCommas(l.price))}
          </tr>

          <tr>
            <th>List Date</th>
            {row(l => date(l.list_date))}
          </tr>

          <tr>
            <th>Status</th>
            {row(l => l.last_status)}
          </tr>

          <tr>
            <th>Date Available</th>
            {row(l => date(l.date_available))}
          </tr>

          <tr>
            <th>DOM</th>
            {row(l => Math.round(l.dom / 86400))}
          </tr>

          <tr>
            <th>Subdivision</th>
            {row(l => l.property.subdivision_name)}
          </tr>

          <tr>
            <th>Prop Type</th>
            {row(l => l.property.property_type)}
          </tr>

          <tr>
            <th>Year Build</th>
            {row(l => l.property.year_built)}
          </tr>

          <tr>
            <th>HOA Free</th>
            {row(l => '$' + (l.association_fee))}
          </tr>

          <tr>
            <th>Sqft Total</th>
            {row(l => helpers.numberWithCommas(listingHelpers.metersToFeet(l.property.square_meters)))}
          </tr>

          <tr>
            <th>Sqft Building</th>
            {row(l => helpers.numberWithCommas(listingHelpers.metersToFeet(l.property.building_square_meters)))}
          </tr>

          <tr>
            <th>Beds</th>
            {row(l => l.property.bedroom_count)}
          </tr>

          <tr>
            <th>Total baths</th>
            {row(l => l.property.bathroom_count)}
          </tr>

          <tr>
            <th># Units</th>
            {row(l => l.property.number_of_units)}
          </tr>

          <tr>
            <th># Stories</th>
            {row(l => l.property.number_of_stories)}
          </tr>

          <tr>
            <th># Living areas</th>
            {row(l => l.property.number_of_living_areas)}
          </tr>

          <tr>
            <th>Pool on prop</th>
            {row(l => l.property.pool_yn ? '✔' : '✖')}
          </tr>

          <tr>
            <th>$/Sqft</th>
            {row(l => '$' + (l.price / (listingHelpers.metersToFeet(l.property.square_meters))).toFixed(2))}
          </tr>

          <tr>
            <th>Score</th>
            {row(l => l.similarity)}
          </tr>
        </tbody>
      </table>
    )
  }

  render() {
    const data = this.props.data
    const main_style = S('absolute l-70 r-0 pl-15 pr-20')

    let content

    if (AppStore.data.similar_listings) {
      if (AppStore.data.similar_listings.searching)
        content = <Loading />

      if (AppStore.data.similar_listings.listings)
        content = this.createTable(AppStore.data.similar_listings.listings)
    }

    return (
      <main style={ S('pt-20') }>
        <SideBar data={ data }/>
        <div style={ main_style }>
          <div style={ S('mb-30') }>
            <form onSubmit={ this.handleSubmit }>
              <FormControl style={ S('w-300') } inputRef={ ref => this.mls_numberInput = ref } type="number" placeholder="MLS Number" onKeyUp={ this.handleMLSNumberChange.bind(this) } />
            </form>
          </div>
          <div>
            {content}
          </div>
        </div>
      </main>
    )
  }
}

Recommend.propTypes = {
  data: React.PropTypes.object
}
