// Dashboard/Cards/index.js
import React, { Component } from 'react'
import SideBar from '../Partials/SideBar'
import S from 'shorti'
export default class Cards extends Component {
  render() {
    // Data
    const data = this.props.data
    const user = data.user
    const main_style = S(`fixed h-100p pl-70 w-100p`)
    return (
      <div style={ S('minw-1000') }>
        <main>
          <SideBar
            data={ data }
          />
          <div style={ main_style }>
            <iframe style={ S('w-100p h-100p absolute') } src={ `https://rechat.site/cards?access_token=${user.access_token}`} frameBorder="0"></iframe>
          </div>
        </main>
      </div>
    )
  }
}

// PropTypes
Cards.propTypes = {
  data: React.PropTypes.object
}