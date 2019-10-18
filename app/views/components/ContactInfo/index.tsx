import React from 'react'
import Avatar from 'react-avatar'

import { ContactInfoContainer } from './styled'
import ContactName from './ContactName'

import { ContactsListType } from '../../../components/Pages/Dashboard/MarketingInsights/Insight/types'

interface ContactInfoPropsType {
  data: ContactsListType
}

function ContactInfo(props: ContactInfoPropsType) {
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
        <ContactName data={props.data} />
        {props.data.to && <span>{props.data.to}</span>}
      </div>
    </ContactInfoContainer>
  )
}

export default ContactInfo
