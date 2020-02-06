import React, { useState } from 'react'
import { Select, MenuItem } from '@material-ui/core'

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

export function Month() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedMonth(event.target.value as number)
  }

  return (
    <Select value={selectedMonth} onChange={handleChange}>
      {MONTHS.map((name, index) => (
        <MenuItem key={index} value={index}>
          {name}
        </MenuItem>
      ))}
    </Select>
  )
}
