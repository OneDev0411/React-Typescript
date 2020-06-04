import React, { useState } from 'react'

import Flex from 'styled-flex-component'

import { Year } from './components/Year'
import { Month } from './components/Month'
import { Week } from './components/Week'

interface Props {
  style?: React.CSSProperties
  onChange: (date: Date) => void
}

export function DatePicker({ style, onChange }: Props) {
  const [date, setDate] = useState(new Date())

  /**
   * set new day
   * @param day
   */
  const handleChangeDate = (day: Date) => {
    setDate(day)
    onChange(day)
  }

  /**
   * set new month
   * @param month
   */
  const handleChangeMonth = (month: number) => {
    const newDate = new Date(date)

    newDate.setMonth(month)

    setDate(newDate)
    onChange(newDate)
  }

  /**
   * set new year
   * @param year
   */
  const handleChangeYear = (year: number) => {
    const newDate = new Date(date)

    newDate.setFullYear(year)

    setDate(newDate)
    onChange(newDate)
  }

  /**
   * go to past week
   */
  const handlePastWeek = () => {
    const newDate = new Date(date)

    newDate.setDate(date.getDate() - 7)

    setDate(newDate)
    onChange(newDate)
  }

  /**
   * go to next week
   */
  const handleNextWeek = () => {
    const newDate = new Date(date)

    newDate.setDate(date.getDate() + 7)

    setDate(newDate)
    onChange(newDate)
  }

  return (
    <Flex style={style}>
      <Month date={date} onChange={handleChangeMonth} />
      <Year date={date} onChange={handleChangeYear} />
      <Week
        date={date}
        onChange={handleChangeDate}
        onClickPastWeek={handlePastWeek}
        onClickNextWeek={handleNextWeek}
      />
    </Flex>
  )
}
