import React, { useState } from 'react'
import { Button } from '@material-ui/core'

interface Props {
  year: number
  month: number
}

export function Week({ year, month }: Props) {
  const [activeDay, setActiveDay] = useState(new Date().getDate())

  return (
    <>
      <Button color="secondary" variant="contained">
        Last Week
      </Button>

      {getDaysOfWeek(year, month, activeDay).map((day, index) => (
        <div key={index}>-</div>
      ))}

      <Button color="secondary" variant="contained">
        Next Week
      </Button>
    </>
  )
}

function getDaysOfWeek(year: number, month: number, day: number): Date[] {
  return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
    (name, index) => {
      return new Date()
    }
  )
}
