import React from 'react'
import emailMask from 'text-mask-addons/dist/emailMask'
import Input from 'react-text-mask'
import _ from 'underscore'

function validate(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  return re.test(email)
}

export default props => (
  <Input
    mask={emailMask}
    {..._.omit(props, 'ErrorMessageHandler', 'data-type')}
    placeholder="dan@rechat.com"
    onChange={e => {
      props.onChange(e, {
        isValid: validate(e.target.value)
      })
    }}
  />
)
