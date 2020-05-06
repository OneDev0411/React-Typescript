import React from 'react'
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  Link,
  MenuItem,
  Select
} from '@material-ui/core'

import { Header } from './Header'

interface Props {
  agents: IAgent[]
  onCancel: () => void
  onChange: (event) => void
  mlsId: string
}

export function MlsSelect({ agents, onChange, mlsId, onCancel }: Props) {
  const defaultValue = '0000'
  const items = [
    {
      name: '--Select--',
      value: defaultValue
    },
    ...agents.map(item => ({
      value: item.id,
      name: `${item.mls}${
        item.first_name || item.last_name
          ? `- ${item.first_name} ${item.last_name}`
          : ''
      }`
    }))
  ]

  return (
    <>
      <div>
        <Header
          title="Choose MLS"
          description={`You entered ${mlsId} for MLS #, Choose which MLS you are in.`}
        />
        <FormControl variant="filled" color="secondary">
          <InputLabel id="select-mls">MLS</InputLabel>
          <Select
            autoWidth
            id="select-mls"
            labelId="select-mls"
            onChange={onChange}
            defaultValue={defaultValue}
          >
            {items.map(item => (
              <MenuItem key={item.value} value={item.value}>
                {item.name}
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
      </div>
      <Box display="flex" justifyContent="flex-end">
        <Button type="button" onClick={onCancel}>
          Cancel
        </Button>
      </Box>
    </>
  )
}
