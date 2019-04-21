import React from 'react'

import { RadioGroup } from 'components/Forms/RadioGroupInput'

import { Container } from './styled'

export const TYPE_PERSON = 'Person'
export const TYPE_COMPANY = 'Organization'

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
