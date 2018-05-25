import React from 'react'

import { isPhoneNumber } from '../../../../../../../utils/validations'

import { MultiField } from '../components/MultiField'
import { PHONE } from '../../../labels-default-options'

export function Phones({ mutators }) {
  return (
    <MultiField
      title="Phone"
      name="phone_number"
      defaultOptions={PHONE}
      defaultSelectedItem={PHONE[0]}
      mutators={mutators}
      validate={isPhoneNumber}
    />
  )
}
