import React, { useState } from 'react'
import { Select, MenuItem } from '@material-ui/core'

export function Year() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedYear(event.target.value as number)
  }

  return (
    <Select value={selectedYear} onChange={handleChange}>
      {getYearsRange().map((value, index) => (
        <MenuItem key={index} value={value}>
          {value}
        </MenuItem>
      ))}
    </Select>
  )
}

function getYearsRange() {
  const startYear = new Date().getFullYear() + 5

  return new Array(20).fill(null).map((_, index) => startYear - index)
}
