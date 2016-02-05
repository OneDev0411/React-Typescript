// ProfileImage.js
import React, { Component } from 'react'
import S from 'shorti'

export default class ProfileImage extends Component {
  render() {
    const user = this.props.user
    const me = this.props.data.user
    const data = this.props.data
    const profile_image_url = user.profile_image_url
    let background = `bg-url(${profile_image_url})`
    let initials
    let top = 8
    if (this.props.top)
      top = this.props.top

    if (!profile_image_url) {
      background = 'bg-dddfe0'
      let first_initial
      if (user.first_name)
        first_initial = user.first_name.substring(0, 1).toUpperCase()
      let last_initial
      if (user.last_name)
        last_initial = user.last_name.substring(0, 1).toUpperCase()
      initials = (
        <div className="text-center" style={ S(`w-100p t-${top} absolute color-fff`) }>
          { first_initial + last_initial }
        </div>
      )
    }

    let width_height
    if (!this.props.size)
      width_height = 'w-35 h-35'
    else
      width_height = `w-${this.props.size} h-${this.props.size}`

    const profile_image_style = S(`bg-cover bg-center ${background} ${width_height} absolute z-2`)
    let online_indicator
    if (data.users_online && user.id !== me.id) {
      let bg_color = 'dddfe0'
      if (data.users_online.includes(user.id))
        bg_color = '35b863'
      online_indicator = <div style={ S('br-100 bg-' + bg_color + ' w-13 h-13 bw-2 solid bc-fff absolute z-100 t-3n r-1') }></div>
    }
    return (
      <div style={ S('inline') }>
        <div className="img-circle" style={ profile_image_style }>
          { online_indicator }
          { initials }
        </div>
      </div>
    )
  }
}

// PropTypes
ProfileImage.propTypes = {
  size: React.PropTypes.number,
  top: React.PropTypes.number,
  user: React.PropTypes.object,
  data: React.PropTypes.object.isRequired
}