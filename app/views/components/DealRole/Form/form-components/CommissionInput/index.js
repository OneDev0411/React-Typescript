import React from 'react'
import Flex from 'styled-flex-component'

import { InputLabel, InputRequired } from 'components/Forms/styled'

import { TextInput } from 'components/Forms/TextInput'

import { RadioGroup } from 'components/Forms/RadioGroupInput'

export function CommissionInput(props) {
  return (
    <Flex
      column
      style={{
        width: '100%',
        paddingBottom: '2px',
        display: props.isVisible ? 'flex' : 'none',
        borderBottom: '1px solid #dce5eb'
      }}
    >
      <InputLabel hasError={props.meta.submitFailed && props.meta.error}>
        {props.label}&nbsp;
        <InputRequired>{props.isRequired && '*'}</InputRequired>
      </InputLabel>

      <Flex alignCenter>
        <RadioGroup
          hasLabel={false}
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

        <TextInput
          {...props.input}
          meta={props.meta}
          style={{
            border: 'none',
            margin: 0,
            padding: 0,
            width: '100%'
          }}
          name="commission"
          hasLabel={false}
          highlightOnError
          showError={false}
          autoComplete="off"
          placeholder="Enter agent commission"
        />
      </Flex>
    </Flex>
  )
}
