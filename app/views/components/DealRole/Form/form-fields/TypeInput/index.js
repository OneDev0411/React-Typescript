import React from 'react'

import { RadioGroup } from 'components/Forms/RadioGroupInput'

import { TYPE_PERSON, TYPE_COMPANY } from '../../../constants/role-types'

export function TypeInput(props) {
  return (
    <RadioGroup
      label="Type"
      options={[
        {
          name: TYPE_PERSON,
          label: 'Person'
        },
        {
          name: TYPE_COMPANY,
          label: 'Company/Trust'
        }
      ]}
      {...props}
    />
  )
}
