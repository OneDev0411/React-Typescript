import React from 'react'

import { SelectInput } from 'components/Forms/SelectInput'

const OPTIONS = ['Mr', 'Ms', 'Mrs', 'Miss', 'Dr']

export const TitleDropDown = ({ input, meta }) => (
  <SelectInput
    className="deals__role-form--select"
    searchable={false}
    clearable
    input={input}
    meta={meta}
    placeholder="Select a title"
    onChange={data => input.onChange(data ? data.value : null)}
    options={OPTIONS.map(value => ({
      value,
      label: value
    }))}
  />
)
