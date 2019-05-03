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
  return (
    <CommissionContainer
      style={{
        display: props.isVisible ? 'flex' : 'none'
      }}
    >
      <CommissionRadioContainer>
        <InputLabel hasError={props.meta.submitFailed && props.meta.error}>
          {props.label}&nbsp;
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
        style={{
          borderBottom: 'none',
          paddingBottom: 0,
          width: '100%'
        }}
        name="commission"
        hasLabel={false}
        highlightOnError
        showError={false}
        Container={CommissionInputContainer}
        autoComplete="off"
        placeholder="Enter agent commission"
      />
    </CommissionContainer>
  )
}
