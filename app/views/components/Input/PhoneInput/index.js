import React from 'react'
import Input from 'react-text-mask'

export default props => (
  <Input
    placeholder="(xxx)xxx-xxxx"
    mask={[
      '(',
      /[1-9]/,
      /\d/,
      /\d/,
      ')',
      ' ',
      /\d/,
      /\d/,
      /\d/,
      '-',
      /\d/,
      /\d/,
      /\d/,
      /\d/
    ]}
    {...props}
    onChange={e => {
      const maskedValue = e.target.value
      const originalValue = maskedValue
        ? maskedValue
            .replace('(', '')
            .replace(')', '')
            .replace(/\s/g, '')
            .replace(/\-/gi, '')
        : ''

      props.onChange(e, originalValue)
    }}
  />
)
