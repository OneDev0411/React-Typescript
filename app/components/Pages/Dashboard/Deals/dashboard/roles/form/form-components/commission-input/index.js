import React from 'react'
import { Field } from 'react-final-form'
import {
  CommissionContainer,
  CommissionRadioContainer,
  CommissionInputContainer,
  InputField,
  InputRadio,
  RadioLabel,
  InputLabel,
  InputError,
  InputRequired
} from '../../styles'

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

    <CommissionInputContainer>
      <InputField
        {...input}
        {...rest}
        autocomplete={false}
        hasError={meta.submitFailed && meta.error}
        placeholder="Enter commission for this agent"
      />

      {meta.error && meta.touched && <InputError>{meta.error}</InputError>}
    </CommissionInputContainer>
  </CommissionContainer>
)
