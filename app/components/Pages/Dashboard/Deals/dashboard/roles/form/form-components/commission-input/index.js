import React from 'react'
import { Field } from 'react-final-form'
import {
  CommissionContainer,
  CommissionRadioContainer,
  CommissionInputContainer,
  InputRadio,
  RadioLabel
} from '../../styles'

import {
  InputLabel,
  InputRequired
} from '../../../../../../../../../views/components/Forms/styled'

import { TextInput } from '../../../../../../../../../views/components/Forms/TextInput'

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
      <div>
        <Field
          name="commission_type"
          render={({ input }) => (
            <InputRadio
              {...input}
              type="radio"
              value="commission_percentage"
              checked={commissionType === 'commission_percentage'}
            />
          )}
        />

        <RadioLabel>%</RadioLabel>

        <Field
          name="commission_type"
          render={({ input }) => (
            <InputRadio
              {...input}
              type="radio"
              value="commission_dollar"
              checked={commissionType === 'commission_dollar'}
            />
          )}
        />

        <RadioLabel>$</RadioLabel>
      </div>
    </CommissionRadioContainer>

    <TextInput
      {...input}
      {...rest}
      Container={CommissionInputContainer}
      meta={meta}
      autocomplete={false}
      placeholder="Enter commission for this agent"
    />
  </CommissionContainer>
)
