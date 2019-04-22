import React from 'react'

import { RadioGroup } from 'components/Forms/RadioGroupInput'

export const TYPE_PERSON = 'Person'
export const TYPE_COMPANY = 'Organization'

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
