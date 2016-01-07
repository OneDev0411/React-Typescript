// Dashboard/Mls/index.js
import React, { Component } from 'react'
import S from 'shorti'

// Partials
import SideBar from '../Partials/SideBar'

export default class Mls extends Component {

  render() {
    const data = this.props.data
    const main_style = S('absolute h-100p l-183 r-0')

    return (
      <div style={ S('minw-1000') }>
        <main>
          <SideBar data={ data }/>
          <div style={ main_style }>
            <div style={ S('absolute w-100p h-100p bg-cover bg-center bg-url(/images/dashboard/mls/map.png)') }></div>
          </div>
        </main>
      </div>
    )
  }
}

// PropTypes
Mls.propTypes = {
  data: React.PropTypes.object
}