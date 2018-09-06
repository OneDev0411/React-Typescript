import React from 'react'

import { Container } from './styled'

import { RadioGroup } from '../../../../../../../../../views/components/Forms/RadioGroupInput'

export const TYPE_PERSON = 'person'
export const TYPE_COMPANY = 'company'

export const FormType = props => (
  <Container>
    <RadioGroup
      {...props}
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
    />
  </Container>
)
