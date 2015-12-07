// ProfileImage.js
import React, { Component } from 'react'
import S from 'shorti'

export default class ProfileImage extends Component {

  render(){
    
    const data = this.props.data
    let profile_image_url = this.props.profile_image_url
    if(!profile_image_url)
      profile_image_url = '/images/dashboard/profile-image-default.png'
    const profile_image_style = S('bg-cover bg-center bg-url(' + profile_image_url + ') w-35 h-35 absolute z-2')

    return (
      <div style={ S('inline') }>
        <div className="img-circle" style={ profile_image_style }></div>
      </div>
    )
  }

}