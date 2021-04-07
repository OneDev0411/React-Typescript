import React from 'react'

import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select
} from '@material-ui/core'

import { hourToSeconds } from './helpers'

const hours = new Array(12).fill(null)

interface ShowingStepAdvanceNoticeLeadTimeOptionsProps {
  label?: string
  value: Nullable<number>
  onChange: (value: number) => void
}

function ShowingStepAdvanceNoticeLeadTimeOptions({
  label = 'Enter Lead Time',
  value,
  onChange
}: ShowingStepAdvanceNoticeLeadTimeOptionsProps) {
  const handleChange = (event: React.ChangeEvent<{ value: number }>) => {
    onChange(event.target.value)
  }

  return (
    <Box mb={1.5} mt={2} mx={1}>
      <FormControl variant="outlined" size="small" fullWidth>
        <InputLabel>{label}</InputLabel>
        <Select
          value={value || ''}
          onChange={handleChange}
          displayEmpty
          label={label}
        >
          <MenuItem value="" hidden />
          {hours.map((a, index) => (
            <MenuItem key={index} value={hourToSeconds(index + 1)}>
              {index + 1} Hour{index > 0 && 's'}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
}

export default ShowingStepAdvanceNoticeLeadTimeOptions
