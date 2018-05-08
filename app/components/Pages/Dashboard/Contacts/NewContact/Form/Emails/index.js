import React from 'react'

import { isEmail } from '../../../../../../../utils/validations'

import { MultiField } from '../components/MultiField'
import { EMAIL } from '../../../labels-default-options'

export function Emails({ mutators }) {
  return (
    <MultiField
      title="Email"
      name="email"
      defaultOptions={EMAIL}
      defaultSelectedItem={EMAIL[0]}
      mutators={mutators}
      validate={isEmail}
    />
  )
}
