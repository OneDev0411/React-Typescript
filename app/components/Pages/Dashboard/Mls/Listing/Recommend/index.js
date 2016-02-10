// Dashboard/Mls/Listing/Recommend.js
import React, { Component } from 'react'
import S from 'shorti'

// Partials
import SideBar from '../../../Partials/SideBar'

import AppDispatcher from '../../../../../../dispatcher/AppDispatcher'
import AppStore from '../../../../../../stores/AppStore'

export default class Recommend extends Component {

  handleMLSNumberChange(e) {
    const user = this.props.data.user
    const mls_number = e.target.value;

    AppDispatcher.dispatch({
      action: 'get-similar-listings',
      user,
      mls_number
    })
  }

  priceRow(listings) {
    return listings.map(listing => {
      return (
        <td>
          {listing.last_price}
        </td>
      )
    });
  }

  photoRow(listings) {
    return listings.map(listing => {
      return (
        <td>
          <img src={listing.cover_image_url} width="100" />
        </td>
      )
    });
  }

  dateRow(listings) {
    return listings.map(listing => {
      var date = new Date();
      return (
        <td>
          Foo
        </td>
      )
    });
  }

  priceRow(listings) {
    return listings.map(listing => {
      return (
        <td>
          {listing.list_price}
        </td>
      )
    });
  }

  statusRow(listings) {
    return listings.map(listing => {
      return (
        <td>
          {listing.last_status}
        </td>
      )
    });
  }

  availableDateRow(listings) {
    return listings.map(listing => {
      return (
        <td>

        </td>
      )
    });
  }

  createTable(listings) {
    const photo_row   = this.photoRow(listings);
    const price_row   = this.priceRow(listings);
    const date_row    = this.dateRow(listings);
    const status_row  = this.statusRow(listings);
    const available_date_row  = this.availableDateRow(listings);

    return (
      <table border="1" width="100%">
        <tbody>
          <tr>
            <th></th>
            { photo_row }
          </tr>

          <tr>
            <th>
              Price
            </th>
            { price_row }
          </tr>

          <tr>
            <th>
              List Date
            </th>
            { date_row }
          </tr>

          <tr>
            <th>
              Status
            </th>
            { status_row }
          </tr>

          <tr>
            <th>
              Avilable Date
            </th>
            { available_date_row }
          </tr>
        </tbody>
      </table>
    )
  }

  render() {
    const data = this.props.data
    const main_style = S('absolute l-183 r-0 pl-15 pr-20')

    let table;
    if(AppStore.data.similar_listings)
      table = this.createTable(AppStore.data.similar_listings.listings);

    return (
      <main style={ S('pt-20') }>
        <SideBar data={ data }/>
        <div style={ main_style }>
          <form>
            <input type="number" placeholder="MLS Number" onKeyUp={ this.handleMLSNumberChange.bind(this) }></input>
          </form>
          <div>
            {table}
          </div>
        </div>
      </main>
    )
  }
}

Recommend.propTypes = {
  data: React.PropTypes.object
}