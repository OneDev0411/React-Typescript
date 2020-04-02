import React from 'react'
import { Field } from 'react-final-form'
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core'

import { useCommonStyles } from '../common-styles'

export function MlsSelect({ items }: { items: IAgent[] }) {
  const commonClasses = useCommonStyles()

  return (
    <Field
      name="agentId"
      render={({ input }) => {
        return (
          <FormControl
            variant="filled"
            color="secondary"
            className={commonClasses.field}
          >
            <InputLabel id="select-mls">MLS</InputLabel>
            <Select
              labelId="select-mls"
              id="select-mls"
              value={input.value}
              onChange={input.onChange}
            >
              {items.map(item => (
                <MenuItem key={item.id} value={item.id}>
                  {item.mls}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )
      }}
    />
  )
}
