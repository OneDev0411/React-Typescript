import React, { useRef, useState, useEffect } from 'react'

import { Button, Popover, Typography, makeStyles } from '@material-ui/core'
import DayPicker, { DayPickerProps } from 'react-day-picker'

import iff from '@app/utils/iff'

import { getTime } from '../../../utils/get-time'
import { setTime } from '../../../utils/set-time'
import { Divider } from '../Divider'
import TimeInput from '../TimeInput'

import { isToday, formatDate } from './helpers'
import { PickerContainer } from './styled'

const useStyles = makeStyles(
  theme => ({
    footer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    inputError: {
      // I know this is not ideal to override the styles of an styled-component like this, but
      // I dont know about that styling method and found no solution to do it in a better way.
      '&&': { borderColor: theme.palette.error.main }
    },
    error: {
      marginTop: theme.spacing(0.5),
      color: theme.palette.error.main
    }
  }),
  { name: 'DateTimePicker' }
)

interface RenderProps {
  rowDate: Date
  formattedDate: string
  isToday: boolean
  handleOpen: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

interface Props {
  style?: React.CSSProperties
  datePickerModifiers?: DayPickerProps['modifiers']
  defaultSelectedDate?: Date
  selectedDate?: Date
  showTimePicker?: boolean
  saveCaption?: string
  defaultAnchorElement?: HTMLElement | null
  children?(renderParams: RenderProps): React.ReactNode
  onChange?(date: Date): void
  onClose?(date: Date | null): void
  validate?: (date: Date) => Optional<string>
}

export function DateTimePicker({
  style,
  showTimePicker = true,
  datePickerModifiers = {},
  defaultSelectedDate = new Date(),
  selectedDate = new Date(),
  children,
  defaultAnchorElement = null,
  saveCaption = 'Done',
  onChange = () => {},
  onClose = () => {},
  validate = () => ''
}: Props) {
  const classes = useStyles()

  const [date, setDate] = useState<Date>(defaultSelectedDate)
  const initialSelectedDate = useRef<Date>(defaultSelectedDate)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(
    defaultAnchorElement
  )
  const formattedDate = formatDate(date, showTimePicker)

  const validationError = showTimePicker ? validate(date) : null

  const isOpen = !!anchorEl

  useEffect(() => {
    if (
      isOpen &&
      initialSelectedDate.current.getTime() !== selectedDate.getTime()
    ) {
      setDate(selectedDate)
    }
  }, [selectedDate, isOpen])

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSave = () => {
    handleClose()
    onClose(date)
  }

  const handleOpen = (e: React.MouseEvent<HTMLElement, MouseEvent>) =>
    setAnchorEl(e.currentTarget)

  const handleChangeTime = (date: Date) => {
    setDate(date)
    onChange(date)
  }

  const handleDate = (selectedDate: Date) => {
    // Pick the time from the internal state and set it to the selected date.
    const nextDate = setTime(selectedDate, getTime(date) as number)

    setDate(nextDate)
    onChange(nextDate)
  }

  return (
    <div style={style}>
      {children ? (
        children({
          rowDate: date,
          isToday: isToday(date),
          formattedDate,
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
          <span>{formattedDate}</span>
        </Button>
      )}

      <Popover
        id={anchorEl ? 'datepicker-popover' : undefined}
        open={isOpen}
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

          <div className={classes.footer}>
            <div>
              {showTimePicker && (
                <TimeInput
                  className={iff(!!validationError, classes.inputError)}
                  initialDate={date}
                  onChange={handleChangeTime}
                />
              )}
            </div>

            <Button
              variant="outlined"
              color="primary"
              data-test="date-picker-done"
              onClick={handleSave}
              disabled={!!validationError}
            >
              {saveCaption}
            </Button>
          </div>
          {validationError && (
            <Typography className={classes.error} variant="body2">
              {validationError}
            </Typography>
          )}
        </PickerContainer>
      </Popover>
    </div>
  )
}
