// Dashboard/Website/index.js
import React, { Component } from 'react'
import S from 'shorti'
import config from '../../../../../config/public'

const API_URL = config.store.url

export default class Website extends Component {
  render() {
    // Data
    const data = this.props.data
    const user = data.user
    let brand = data.brand
    let brand_id
    if (!brand) {
      brand = user.brand
    }
    if (brand) {
      brand_id = brand
    }
    const main_style = S('absolute h-100p w-100p')
    return (
      <div style={S('minw-1000')}>
        <main>
          <div style={main_style}>
            <iframe
              style={S('w-100p h-100p absolute')}
              src={`${API_URL}/store?access_token=${user.access_token}${brand_id ? `&brand=${brand_id}` : ''}`}
              frameBorder="0"
            />
          </div>
        </main>
      </div>
    )
  }
}

// PropTypes
Website.propTypes = {
  data: React.PropTypes.object
}