// TODO: should be removed and use standard DateTimeField component
/*
  Update: Thu Aug 26
  A year ago, I added a todo to use our standard DateTimeField component here,
  this component has been developed wrong by our previous team member (Hesam) and
  from that time I couldn't find free time to take care of it, and now I have to move
  this component from final-from-fields folder to sub-folder of EventDrawer component
  since it's just used there and should not use it anywhere in future, another reason
  that I'm doing this, is mimicking the google calendar updating end-date so I have to
  add it some extra code base on Shayan request.
*/

import { useState, useRef } from 'react'

import {
  Box,
  Button,
  ClickAwayListener,
  Grow,
  Popper,
  Typography
} from '@material-ui/core'
import { PopperPlacementType } from '@material-ui/core/Popper'
import { useTheme } from '@material-ui/core/styles'
import fecha from 'fecha'
import DayPicker, { Modifiers } from 'react-day-picker'
import { Field, FieldRenderProps } from 'react-final-form'
import Flex from 'styled-flex-component'

import { PickerContainer } from 'components/DateTimePicker/styled'
import { Divider } from 'components/Divider'
import TimeInput from 'components/TimeInput'

import { DueDateWatcher } from '../DueDateWatcher'

interface Props {
  dueDate: Date
  endDate: Date
  selectedDate: Date
  showTimePicker?: boolean
  datePickerModifiers?: Partial<Modifiers>
  placement?: PopperPlacementType
}

export function EndDateTimeField({
  dueDate,
  endDate: endDateProp,
  selectedDate,
  showTimePicker = true,
  datePickerModifiers,
  placement = 'bottom-end'
}: Props) {
  const theme = useTheme()

  const anchorRef = useRef<HTMLButtonElement>(null)

  const [endDate, setEndDate] = useState(endDateProp)
  const [isEndDateTouchedManually, setIsEndDateTouchedManually] =
    useState(false)
  const [isEndTimeTouchedManually, setIsEndTimeTouchedManually] =
    useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const id = isOpen ? 'end-date-time-field' : undefined
  const formatter = showTimePicker ? 'MMM D, YYYY hh:mm A' : 'MMM D, YYYY'

  function handleClose(event: any) {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return
    }

    setIsOpen(false)
  }

  return (
    <>
      <DueDateWatcher
        dueDate={dueDate}
        endDate={endDateProp}
        onEndDateChange={setEndDate}
        isEndDateTouchedManually={isEndDateTouchedManually}
        isEndTimeTouchedManually={isEndTimeTouchedManually}
      />
      <Field
        name="endDate"
        initialValue={endDateProp}
        render={(fieldProps: FieldRenderProps<any>) => {
          const { value, onChange } = fieldProps.input

          return (
            <Box display="flex" alignItems="center" pr={1}>
              {value && <Typography variant="body2">To</Typography>}
              <Button
                aria-describedby={id}
                color="secondary"
                ref={anchorRef}
                onClick={() => {
                  setIsOpen(!isOpen)
                }}
              >
                {fecha.format(value, formatter)}
              </Button>
              <Popper
                anchorEl={anchorRef.current}
                open={isOpen}
                placement={placement}
                style={{ zIndex: theme.zIndex.modal }}
                transition
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin:
                        placement === 'bottom' ? 'center top' : 'center bottom'
                    }}
                  >
                    <ClickAwayListener onClickAway={handleClose}>
                      <PickerContainer>
                        <DayPicker
                          initialMonth={endDate}
                          selectedDays={endDate}
                          disabledDays={{
                            before: dueDate || endDate
                          }}
                          onDayClick={date => {
                            date.setHours(
                              endDate.getHours(),
                              endDate.getMinutes(),
                              endDate.getSeconds(),
                              endDate.getMilliseconds()
                            )
                            setEndDate(date)
                            setIsEndDateTouchedManually(true)
                            // @ts-ignore FinalForm bug
                            value && onChange(date)
                          }}
                          modifiers={datePickerModifiers}
                        />

                        <Divider margin="0.5em 0" />

                        <Flex alignCenter justifyBetween>
                          <div>
                            {showTimePicker && (
                              <TimeInput
                                initialDate={endDate}
                                onChange={(date: Date) => {
                                  const newEndDate = new Date(endDate)

                                  newEndDate.setHours(
                                    date.getHours(),
                                    date.getMinutes(),
                                    date.getSeconds(),
                                    date.getMilliseconds()
                                  )
                                  setEndDate(newEndDate)
                                  setIsEndTimeTouchedManually(true)
                                  // @ts-ignore FinalForm bug
                                  value && onChange(newEndDate)
                                }}
                              />
                            )}
                          </div>
                          <Button
                            variant="text"
                            color="secondary"
                            onClick={event => {
                              // @ts-ignore FinalForm bug
                              onChange(endDate)
                              handleClose(event)
                            }}
                          >
                            {value ? 'Done' : 'Add'}
                          </Button>
                        </Flex>
                      </PickerContainer>
                    </ClickAwayListener>
                  </Grow>
                )}
              </Popper>
            </Box>
          )
        }}
      />
    </>
  )
}
