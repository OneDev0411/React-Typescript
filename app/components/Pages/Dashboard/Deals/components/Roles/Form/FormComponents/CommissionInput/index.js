import React from 'react'

import { InputLabel, InputRequired } from 'components/Forms/styled'

import { TextInput } from 'components/Forms/TextInput'

import { RadioGroup } from 'components/Forms/RadioGroupInput'

import {
  CommissionContainer,
  CommissionRadioContainer,
  CommissionInputContainer
} from './styled'

export const CommissionInput = ({
  input,
  meta,
  commissionType,
  isRequired,
  placeholder,
  ...rest
}) => (
  <CommissionContainer>
    <CommissionRadioContainer>
      <InputLabel hasError={meta.submitFailed && meta.error}>
        {placeholder} <InputRequired>{isRequired && '*'}</InputRequired>
      </InputLabel>

      <RadioGroup
        name="commission_type"
        selectedValue={commissionType}
        options={[
          {
            name: 'commission_percentage',
            label: '%'
          },
          {
            name: 'commission_dollar',
            label: '$'
          }
        ]}
      />
    </CommissionRadioContainer>

    <TextInput
      {...input}
      {...rest}
      meta={meta}
      hasLabel={false}
      highlightOnError
      Container={CommissionInputContainer}
      autoComplete="off"
      placeholder="Enter commission for this agent"
    />
  </CommissionContainer>
)
