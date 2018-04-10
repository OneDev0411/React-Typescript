import React from 'react'
import Avatar from 'react-avatar'

const TagsString = ({ name, avatar }) => (
  <div className="name">
    <Avatar className="avatar" round name={name} src={avatar} size={35} />
    <span className="contact-name">{name}</span>
  </div>
)

export default TagsString
