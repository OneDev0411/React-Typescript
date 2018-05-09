import React from 'react'
import Select from 'react-select'
import { InputContainer, InputLabel } from '../../styles'

const OPTIONS = ['Mr', 'Ms', 'Mrs', 'Miss', 'Dr']

export const TitleDropDown = ({ input, placeholder }) => (
  <InputContainer>
    <InputLabel>{placeholder}</InputLabel>
    <Select
      className="deals__role-form--select"
      searchable={false}
      clearable={false}
      placeholder="Select a title"
      value={input.value}
      onChange={({ value }) => input.onChange(value)}
      options={OPTIONS.map(value => ({
        value,
        label: value
      }))}
    />
  </InputContainer>
)
