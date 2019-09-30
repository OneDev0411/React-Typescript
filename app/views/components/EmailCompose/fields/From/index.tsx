import { FieldRenderProps } from 'react-final-form'
import * as React from 'react'
import { ReactNode } from 'react'
import { Box, FormLabel, MenuItem, Select } from '@material-ui/core'

import { EmailFormValues } from '../../types'

export function From({
  input,
  options,
  children,
  ...props
}: FieldRenderProps<any> & {
  options: Exclude<EmailFormValues['from'], undefined>[]
  children: ReactNode
}) {
  const inputValue: EmailFormValues['from'] = input.value

  const hasOptions = options && options.length > 0

  const handleChange = (event: React.ChangeEvent<{ value: string }>) => {
    const selectedOption = (options || []).find(
      option => option.value === event.target.value
    )

    if (selectedOption) {
      input.onChange(selectedOption as any)
    }
  }

  return (
    <Box display="flex" alignItems="center" my={1}>
      <FormLabel style={{ marginBottom: 0 }}>From</FormLabel>
      <Box flex="1" px={2}>
        {hasOptions ? (
          <Select
            value={inputValue && inputValue.value}
            onChange={handleChange}
            disableUnderline
            inputProps={{
              name: input.name,
              id: 'email-compose-from'
            }}
          >
            {options &&
              options.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
          </Select>
        ) : (
          inputValue && inputValue.label
        )}
      </Box>
      {children}
    </Box>
  )
}
