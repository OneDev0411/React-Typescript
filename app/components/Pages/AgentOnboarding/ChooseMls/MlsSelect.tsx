import React from 'react'
import { Field } from 'react-final-form'
import {
  FormControl,
  FormHelperText,
  Link,
  InputLabel,
  Select,
  MenuItem
} from '@material-ui/core'

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
            <FormHelperText variant="standard">
              <span>Couldn't find your MLS in here? Send us an email to </span>
              <Link
                target="_blank"
                color="secondary"
                href="mailto:support@rechat.com"
              >
                support@rechat.com
              </Link>
              <span> and we'll activate your account for you.</span>
            </FormHelperText>
          </FormControl>
        )
      }}
    />
  )
}
