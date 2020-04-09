import React from 'react'

import { TextMiddleTruncate } from 'components/TextMiddleTruncate'

export const ContactInfo = props => {
  const { email, phone } = props.agent

  return (
    <>
      <div>
        <TextMiddleTruncate text={email} maxLength={25} />
      </div>
      <div>{phone}</div>
    </>
  )
}
