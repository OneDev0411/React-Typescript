import React from 'react'
import emailMask from 'text-mask-addons/dist/emailMask'
import Input from 'react-text-mask'

export default props => (
  <Input
    placeholder="dan@rechat.com"
    mask={emailMask}
    {...props}
    onChange={props.onChange}
  />
)
