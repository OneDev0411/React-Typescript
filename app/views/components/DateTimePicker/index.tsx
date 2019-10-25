import React, { useState } from 'react'

import DayPicker from 'react-day-picker'
import Flex from 'styled-flex-component'

import { Button, Popover } from '@material-ui/core'

import { getTime } from '../../../utils/get-time'
import { setTime } from '../../../utils/set-time'

import { Divider } from '../Divider'

import TimeInput from '../TimeInput'

import { PickerContainer } from './styled'
import { isToday, formatDate } from './helpers'

interface Props {
  style?: React.CSSProperties
  datePickerModifiers?: object
  selectedDate?: Date
  onChange(date: Date): void
}

export function DateTimePicker({
  style,
  datePickerModifiers = {},
  selectedDate = new Date(),
  onChange
}: Props) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const handleClose = () => setAnchorEl(null)

  const handleOpen = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
    setAnchorEl(e.currentTarget)

  const handleDate = (date: Date) =>
    onChange(setTime(date, getTime(selectedDate) as number))

  return (
    <div style={style}>
      <Button
        variant="text"
        color="primary"
        data-test="date-time-picker-button"
        onClick={handleOpen}
      >
        {isToday(selectedDate) && <span>Today,&nbsp;</span>}
        <span>{formatDate(selectedDate)}</span>
      </Button>

      <Popover
        id={anchorEl ? 'datepicker-popover' : undefined}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
      >
        <PickerContainer>
          <DayPicker
            initialMonth={selectedDate}
            selectedDays={selectedDate}
            onDayClick={handleDate}
            modifiers={datePickerModifiers}
          />

          <Divider margin="0.5em 0" />

          <Flex alignCenter justifyBetween>
            <TimeInput initialDate={selectedDate} onChange={onChange} />

            <Button
              variant="text"
              color="primary"
              data-test="date-picker-done"
              onClick={handleClose}
            >
              Done
            </Button>
          </Flex>
        </PickerContainer>
      </Popover>
    </div>
  )
}
