import React, { useMemo, useCallback, ChangeEvent } from 'react'
import { useSelector } from 'react-redux'

import { Field } from 'react-final-form'
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@material-ui/core'

import { selectDefsBySection } from 'reducers/contacts/attributeDefs'

import { IAppState } from 'reducers'

export const EventType = props => {
  const dateAttributes = useSelector(({ contacts }: IAppState) =>
    selectDefsBySection(contacts.attributeDefs, 'Dates')
  )

  const triggerOptions = useMemo(() => {
    return [
      {
        label: 'Select a trigger...',
        value: 0
      },
      {
        label: 'Previous Step',
        value: 'last_step_date'
      },
      ...dateAttributes.map(attribute => ({
        label: attribute.label,
        value: attribute.name
      }))
    ]
  }, [dateAttributes])

  const getSelectedItem = useCallback(
    value => {
      const defaultValue = triggerOptions[0]

      const template = triggerOptions.find(item => item.value === value)

      return template || defaultValue
    },
    [triggerOptions]
  )

  const handleValidation = value => {
    if (value) {
      return
    }

    return 'No Trigger selected'
  }

  return (
    <Field
      isRequired
      name="event_type"
      label="Event Type"
      text="Select a trigger"
      validate={handleValidation}
      render={({ input: { name, onChange, value }, meta }) => {
        const showError = Boolean(meta.submitFailed && meta.error)

        return (
          <FormControl
            fullWidth
            variant="outlined"
            size="small"
            color="secondary"
            error={showError}
          >
            <InputLabel id="email_template">Trigger</InputLabel>
            <Select
              labelId="event_type"
              id="event_type-select"
              name={name}
              value={getSelectedItem(value).value}
              onChange={(event: ChangeEvent<{ value: string | number }>) => {
                const value = event.target.value

                onChange(value)
              }}
              label="Trigger"
            >
              {triggerOptions.map(item => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
            {showError && (
              <FormHelperText variant="standard">{meta.error}</FormHelperText>
            )}
          </FormControl>
        )
      }}
    />
  )
}
