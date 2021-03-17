import React from 'react'
import { Field } from 'react-final-form'

import {
  Grid,
  Box,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel
} from '@material-ui/core'

interface Props {
  isVisible: boolean
  isRequired: boolean
  compact: boolean
}

export function CommissionInput({ isVisible, isRequired, compact }: Props) {
  if (!isVisible) {
    return null
  }

  return (
    <>
      <Grid item xs={12} md={compact ? 12 : true}>
        <Field
          name="commission"
          parse={value => (!value ? value : value.replace(/[^0-9.]/g, ''))}
          render={({ input, meta }) => (
            <TextField
              {...input}
              fullWidth
              size="small"
              error={meta.error || (isRequired && !input.value)}
              label={`Commission${isRequired ? ' *' : ''}`}
              variant="outlined"
              autoComplete="off"
              placeholder="Enter agent commission"
              inputProps={{
                maxLength: 8
              }}
              style={{
                flex: 5
              }}
            />
          )}
        />
      </Grid>

      <Grid item xs={12} md={compact ? 12 : true}>
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
      </Grid>
    </>
  )
}
