import React from 'react'

export const ContactInfo = props => {
  const { email, phone } = props.agent

  return (
    <React.Fragment>
      <div>{email}</div>
      <div>{phone}</div>
    </React.Fragment>
  )
}
