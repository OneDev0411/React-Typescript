// ProfileImageMultiple.js
import React, { Component } from 'react'
import S from 'shorti'
export default class ProfileImageMultiple extends Component {
  render() {
    const users = this.props.users
    return (
      <div style={ S('inline') }>
        <div style={ S('font-14 w-40 h-40 br-100 absolute text-center pt-10 color-fff bg-2196f3 op-.7') }>
          { users.length - 1 }
        </div>
      </div>
    )
  }
}

// PropTypes
ProfileImageMultiple.propTypes = {
  users: React.PropTypes.object.array
}