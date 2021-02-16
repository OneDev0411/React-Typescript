import React from 'react'

import { Box, RadioGroup, Radio, FormControlLabel } from '@material-ui/core'
import { Field } from 'react-final-form'

import { TYPE_PERSON, TYPE_COMPANY } from '../../../constants/role-types'

interface Props {
  label: string
  name: string
  selectedValue: 'Person' | 'Organization'
}

export function TypeInput(props: Props) {
  return (
    <Field
      name={props.name}
      render={({ input }) => (
        <RadioGroup
          aria-label="commission"
          name="commission"
          value={input.value || TYPE_PERSON}
          onChange={(_, value) => input.onChange(value)}
        >
          <Box display="flex">
            <FormControlLabel
              value={TYPE_PERSON}
              control={<Radio color="primary" />}
              label="Person"
            />
            <FormControlLabel
              value={TYPE_COMPANY}
              control={<Radio color="primary" />}
              label="Company / Trust"
            />
          </Box>
        </RadioGroup>
      )}
    />
  )
}
