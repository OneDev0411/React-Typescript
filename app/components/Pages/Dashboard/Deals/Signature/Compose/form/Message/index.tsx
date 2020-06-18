import React from 'react'

import { useField } from 'react-final-form'

import { TextArea } from 'components/Forms/TextArea'

export function Message() {
  const field = useField('message')

  return (
    <TextArea
      labelText="Message"
      placeholder="Write your Message..."
      containerStyle={{
        borderBottom: 'none'
      }}
      minRows={7}
      maxRows={1000}
      {...field}
    />
  )
}
