import React from 'react'
import emailMask from 'text-mask-addons/dist/emailMask'
import Input from 'react-text-mask'
import _ from 'underscore'

export default props => (
  <Input
    placeholder="dan@rechat.com"
    mask={emailMask}
    {..._.omit(props, 'ErrorMessageHandler', 'data-type')}
    onChange={props.onChange}
  />
)
