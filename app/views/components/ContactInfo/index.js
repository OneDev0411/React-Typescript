import React from 'react'
import Avatar from 'react-avatar'

import { ContactInfoContainer } from './styled'

function ContactInfo(props) {
  return (
    <ContactInfoContainer>
      <div className="profile-picture">
        <Avatar
          className="avatar"
          color="#000"
          round
          name={props.data.display_name || props.data.to}
          src={props.data.profile_image_url}
          size={32}
        />
      </div>
      <div className="profile-info">
        {props.data.display_name && <span>{props.data.display_name}</span>}
        {props.data.to && <span>{props.data.to}</span>}
      </div>
    </ContactInfoContainer>
  )
}

export default ContactInfo
