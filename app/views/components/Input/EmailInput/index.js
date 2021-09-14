import React from 'react'

import Input from 'react-text-mask'
import emailMask from 'text-mask-addons/dist/emailMask'
import _ from 'underscore'

function validate(email) {
  const re =
    // eslint-disable-next-line max-len
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  return re.test(email)
}

export default props => (
  <Input
    mask={emailMask}
    placeholder="example@gmail.com"
    {..._.omit(props, 'ErrorMessageHandler', 'data-type')}
    onChange={e => {
      props.onChange(e, {
        isValid: validate(e.target.value)
      })
    }}
  />
)
