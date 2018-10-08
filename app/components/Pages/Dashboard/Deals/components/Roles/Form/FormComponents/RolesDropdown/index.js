import React from 'react'
import _ from 'underscore'
import { roleName } from '../../../../../utils/roles'

import { SelectInput } from 'components/Forms/SelectInput'

export const RolesDropDown = ({
  input,
  meta,
  formRole,
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
    <SelectInput
      isRequired={isRequired}
      className="deals__role-form--select"
      searchable={false}
      clearable={false}
      input={input}
      meta={meta}
      placeholder="Select a role"
      onChange={({ value = null }) => input.onChange(value)}
      options={sortedOptions}
    />
  )
}
