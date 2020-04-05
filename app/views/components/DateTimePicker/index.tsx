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

interface RenderProps {
  handleOpen: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

interface Props {
  style?: React.CSSProperties
  datePickerModifiers?: object
  selectedDate?: Date
  showTimePicker?: boolean
  saveCaption?: string
  defaultAnchorElement?: HTMLElement | null
  children?({ handleOpen }: RenderProps): React.ReactNode
  onChange?(date: Date): void
  onClose?(date: Date | null): void
}

export function DateTimePicker({
  style,
  showTimePicker = true,
  datePickerModifiers = {},
  selectedDate = new Date(),
  children,
  defaultAnchorElement = null,
  saveCaption = 'Done',
  onChange = () => {},
  onClose = () => {}
}: Props) {
  const [date, setDate] = useState<Date>(selectedDate)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(
    defaultAnchorElement
  )

  const handleClose = () => {
    setAnchorEl(null)

    onClose(date)
  }

  const handleOpen = (e: React.MouseEvent<HTMLElement, MouseEvent>) =>
    setAnchorEl(e.currentTarget)

  const handleChangeTime = (date: Date) => {
    setDate(date)
    onChange(date)
  }

  const handleDate = (date: Date) => {
    const nextDate = setTime(date, getTime(selectedDate) as number)

    setDate(nextDate)
    onChange(nextDate)
  }

  return (
    <div style={style}>
      {children ? (
        children({
          handleOpen
        })
      ) : (
        <Button
          variant="text"
          color="secondary"
          data-test="date-time-picker-button"
          onClick={handleOpen}
        >
          {isToday(date) && <span>Today,&nbsp;</span>}
          <span>{formatDate(date)}</span>
        </Button>
      )}

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
            initialMonth={date}
            selectedDays={date}
            onDayClick={handleDate}
            modifiers={datePickerModifiers}
          />

          <Divider margin="0.5em 0" />

          <Flex alignCenter justifyBetween>
            <div>
              {showTimePicker && (
                <TimeInput initialDate={date} onChange={handleChangeTime} />
              )}
            </div>

            <Button
              variant="outlined"
              data-test="date-picker-done"
              onClick={handleClose}
            >
              {saveCaption}
            </Button>
          </Flex>
        </PickerContainer>
      </Popover>
    </div>
  )
}
