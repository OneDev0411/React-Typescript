import React from 'react'
import Select from 'react-select'
import _ from 'underscore'
import {
  InputContainer,
  InputError,
  InputLabel,
  InputRequired
} from '../../styles'
import { roleName } from '../../../../../utils/roles'

export const RolesDropDown = ({
  input,
  meta,
  formRole,
  placeholder,
  isRequired,
  options,
  isAllowed
}) => {
  const sortedOptions = _.chain(options)
    .map(value => ({
      value,
      label: roleName(value),
      disabled: !isAllowed(value, formRole)
    }))
    .sortBy(item => item.disabled)
    .value()

  return (
    <InputContainer>
      <InputLabel>
        {placeholder} <InputRequired>{isRequired && '*'}</InputRequired>
      </InputLabel>
      <Select
        className="deals__role-form--select"
        clearable={false}
        placeholder="Select a role"
        value={input.value}
        onChange={({ value = null }) => input.onChange(value)}
        options={sortedOptions}
      />
      {meta.error && meta.touched && <InputError>{meta.error}</InputError>}
    </InputContainer>
  )
}
