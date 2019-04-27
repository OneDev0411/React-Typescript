import React from 'react'

import { InputLabel, InputRequired } from 'components/Forms/styled'

import { TextInput } from 'components/Forms/TextInput'

import { RadioGroup } from 'components/Forms/RadioGroupInput'

import {
  CommissionContainer,
  CommissionRadioContainer,
  CommissionInputContainer
} from './styled'

export function CommissionInput(props) {
  if (props.isVisible === false) {
    return false
  }

  return (
    <CommissionContainer>
      <CommissionRadioContainer>
        <InputLabel hasError={props.meta.submitFailed && props.meta.error}>
          {props.placeholder}{' '}
          <InputRequired>{props.isRequired && '*'}</InputRequired>
        </InputLabel>

        <RadioGroup
          name="commission_type"
          selectedValue={props.commissionType}
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
        {...props.input}
        meta={props.meta}
        hasLabel={false}
        highlightOnError
        Container={CommissionInputContainer}
        autoComplete="off"
        placeholder="Enter commission for this agent"
      />
    </CommissionContainer>
  )
}
