import React from 'react'
import { Field } from 'react-final-form'

import {
  Box,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel
} from '@material-ui/core'

interface Props {
  isVisible: boolean
  isRequired: boolean
}

export function CommissionInput({ isVisible, isRequired }: Props) {
  if (!isVisible) {
    return null
  }

  return (
    <Box display="flex">
      <Box width="49%" mr="2%">
        <Field
          name="commission"
          parse={value => (!value ? value : value.replace(/[^0-9.]/g, ''))}
          render={({ input, meta }) => (
            <TextField
              {...input}
              fullWidth
              size="small"
              error={meta.error}
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

      <Box width="49%">
        <Field
          name="commission_type"
          render={({ input }) => (
            <RadioGroup
              aria-label="commission"
              name="commission"
              value={input.value}
              onChange={(_, value) => input.onChange(value)}
            >
              <Box display="flex">
                <FormControlLabel
                  value="commission_percentage"
                  control={<Radio color="primary" />}
                  label="% Percentage"
                />
                <FormControlLabel
                  value="commission_dollar"
                  control={<Radio color="primary" />}
                  label="$ Dollars"
                />
              </Box>
            </RadioGroup>
          )}
        />
      </Box>
    </Box>
  )
}
