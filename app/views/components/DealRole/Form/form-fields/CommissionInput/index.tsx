import React from 'react'
import { Field } from 'react-final-form'

import { Box, TextField, Theme, useTheme } from '@material-ui/core'

import { RadioGroup } from 'components/RadioGroup'

interface Props {
  isVisible: boolean
  isRequired: boolean
}

export function CommissionInput({ isVisible, isRequired }: Props) {
  const theme = useTheme<Theme>()

  if (!isVisible) {
    return null
  }

  return (
    <Box display="flex">
      <Field
        name="commission_type"
        render={({ input }) => (
          <RadioGroup
            name="CommissionType"
            defaultValue={input.value}
            options={[
              {
                value: 'commission_percentage',
                label: '%'
              },
              {
                value: 'commission_dollar',
                label: '$'
              }
            ]}
            onChange={value => input.onChange(value)}
            style={{
              display: 'flex',
              flex: 5
            }}
            groupStyle={{
              width: `calc(50% - ${theme.spacing(1)}px`,
              marginRight: theme.spacing(1)
            }}
          />
        )}
      />

      <Field
        name="commission"
        parse={value => (!value ? value : value.replace(/[^0-9.]/g, ''))}
        render={({ input, meta }) => (
          <TextField
            {...input}
            error={meta.submitFailed && meta.error}
            helperText={meta.error}
            label={`Commission${isRequired ? ' *' : ''}`}
            variant="outlined"
            autoComplete="off"
            placeholder="Enter agent commission"
            style={{
              flex: 5
            }}
          />
        )}
      />
    </Box>
  )
}
