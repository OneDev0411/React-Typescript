// Dashboard/Website/index.js
import React, { Component } from 'react'
import SideBar from '../Partials/SideBar'
import S from 'shorti'
export default class Website extends Component {
  render() {
    // Data
    const data = this.props.data
    const user = data.user
    let brand = data.brand
    let brand_id
    if (!brand)
      brand = user.brand
    if (brand)
      brand_id = brand.id
    const main_style = S('absolute h-100p border-left-70-solid-fff w-100p')
    return (
      <div style={S('minw-1000')}>
        <main>
          <SideBar
            data={data}
          />
          <div style={main_style}>
            <iframe style={S('w-100p h-100p absolute')} src={`https://rechat.site/store?access_token=${user.access_token}${brand_id ? `&brand=${brand_id}` : ''}`} frameBorder="0" />
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