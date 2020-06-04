import React from 'react'
import {
  FormControl,
  InputLabel,
  Select,
  Input,
  MenuItem
} from '@material-ui/core'

import { NeighborhoodReportMetricData } from './types'

interface Props {
  periods: NeighborhoodReportMetricData[]
  selectedPeriod: string
  onChange: (keys: string) => void
}

export default function ReportPeriodSelector({
  periods,
  selectedPeriod,
  onChange
}: Props) {
  const handleChange = (event: any) => {
    onChange(event.target.value as string)
  }

  return (
    <FormControl fullWidth>
      <InputLabel id="report-period-label">Report Period</InputLabel>
      <Select
        labelId="report-period-label"
        id="report-period"
        variant="outlined"
        value={selectedPeriod}
        onChange={handleChange}
        input={<Input />}
      >
        {periods.map(period => (
          <MenuItem key={period.key} value={period.key}>
            {period.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
