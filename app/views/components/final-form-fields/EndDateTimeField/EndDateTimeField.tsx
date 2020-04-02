import React, { useState, useRef } from 'react'
import fecha from 'fecha'
import { Field, FieldRenderProps } from 'react-final-form'
import DayPicker, { Modifiers } from 'react-day-picker'
import Flex from 'styled-flex-component'
import {
  Theme,
  Box,
  Button,
  IconButton,
  ClickAwayListener,
  Grow,
  Popper,
  Tooltip,
  Typography
} from '@material-ui/core'
import { PopperPlacementType } from '@material-ui/core/Popper'
import { makeStyles, useTheme } from '@material-ui/core/styles'

import TimeInput from 'components/TimeInput'
import IconClose from 'components/SvgIcons/Close/CloseIcon'
import { Divider } from 'components/Divider'
import { PickerContainer } from 'components/DateTimePicker/styled'

import { useIconStyles } from '../../../../styles/use-icon-styles'

const useStyles = makeStyles((theme: Theme) => ({
  removeButton: {
    minWidth: 0
  },
  addButton: {
    marginLeft: theme.spacing(1)
  }
}))

interface Props {
  dueDate: Date
  datePickerModifiers?: Partial<Modifiers>
  placement?: PopperPlacementType
}

export function EndDateTimeField({
  dueDate,
  datePickerModifiers,
  placement = 'bottom-end'
}: Props) {
  const theme = useTheme()
  const classes = useStyles()
  const iconClasses = useIconStyles()

  const anchorRef = useRef<HTMLButtonElement>(null)

  const [endDate, setEndDate] = useState(dueDate)
  const [isOpen, setIsOpen] = useState(false)

  const id = isOpen ? 'end-date-time-field' : undefined

  function handleClose(event: any) {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return
    }

    setIsOpen(false)
  }

  return (
    <Field
      name="endDate"
      render={(fieldProps: FieldRenderProps<any>) => {
        const { value, onChange } = fieldProps.input

        return (
          <Box display="flex" alignItems="center" pr={1}>
            {value && <Typography variant="body2">To</Typography>}
            <Button
              aria-describedby={id}
              color="primary"
              ref={anchorRef}
              onClick={() => {
                setEndDate(value || dueDate)
                setIsOpen(!isOpen)
              }}
            >
              {value
                ? fecha.format(value, 'MMM D, YYYY hh:mm A')
                : 'Add End Time'}
            </Button>
            {value && (
              <Tooltip placement={placement} title="Remove Time">
                <IconButton
                  // @ts-ignore FinalForm bug
                  onClick={() => onChange(null)}
                  className={classes.removeButton}
                >
                  <IconClose className={iconClasses.small} />
                </IconButton>
              </Tooltip>
            )}
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
                        onDayClick={date => {
                          date.setHours(
                            endDate.getHours(),
                            endDate.getMinutes(),
                            endDate.getSeconds(),
                            endDate.getMilliseconds()
                          )
                          setEndDate(date)
                          // @ts-ignore FinalForm bug
                          value && onChange(date)
                        }}
                        modifiers={datePickerModifiers}
                      />

                      <Divider margin="0.5em 0" />

                      <Flex alignCenter justifyBetween>
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
                            // @ts-ignore FinalForm bug
                            value && onChange(newEndDate)
                          }}
                        />
                        <Button
                          variant="text"
                          color="primary"
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
  )
}
