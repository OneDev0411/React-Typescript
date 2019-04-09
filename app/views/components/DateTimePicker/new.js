import React, { useState, useCallback } from 'react'
import DatePicker from 'react-day-picker'
import ClickOutSide from 'react-click-outside'
import Flex from 'styled-flex-component'
import PropTypes from 'prop-types'

import ActionButton from 'components/Button/ActionButton'
import { PickerContainer } from 'components/DateTimePicker/styled'
import { Divider } from 'components/Divider'
import { TimePicker } from 'components/TimePicker'

import { setTimeStringToDate } from './helpers'

function PickerPopUp(props) {
  const { isPopUpOpen, onClose, containerStyle, children } = props

  return (
    isPopUpOpen && (
      <div style={{ position: 'relative' }}>
        <ClickOutSide onClickOutside={onClose}>
          <PickerContainer depth={3} style={containerStyle}>
            {children}
          </PickerContainer>
        </ClickOutSide>
      </div>
    )
  )
}

// if it's null, returns a date
function dateFallback(val) {
  return val || new Date()
}

function Picker(props) {
  const handleChangeDate = date => props.onChange(date)
  const handleChangeTime = time =>
    props.onChange(setTimeStringToDate(props.selectedDate, time))

  return (
    <React.Fragment>
      <DatePicker
        selectedDays={props.selectedDate}
        month={props.selectedDate}
        onDayClick={handleChangeDate}
      />
      <Divider margin="0.5em 0" />
      <TimePicker
        defaultTime={dateFallback(props.selectedDate)}
        onChange={handleChangeTime}
      />
      <Divider margin="0.5em 0" />
      <Flex alignCenter justifyBetween>
        <ActionButton
          size="small"
          type="button"
          onClick={props.onDone}
          disabled={!props.selectedDate}
          style={{ fontWeight: 500 }}
        >
          {'Update'}
        </ActionButton>
      </Flex>
    </React.Fragment>
  )
}

function DateTimePicker(props) {
  // State
  const [selectedDate, setDate] = useState(props.selectedDate)
  const [isPopUpOpen, setOpen] = useState(props.isPopUpOpen)

  // Callbacks
  const toggleOpen = useCallback(() => {
    setOpen(!isPopUpOpen)
  }, [isPopUpOpen])

  const handleChange = useCallback(date => {
    setDate(date)
  }, [])

  const handleDone = useCallback(() => {
    if (!selectedDate) {
      return false
    }

    // Trigger handler
    props.onDone(selectedDate)

    // Close PopUp
    toggleOpen()
  }, [selectedDate])

  // Extract needed props
  const { mode, containerStyle } = props

  // Which mode?
  let component = (
    <Picker
      selectedDate={selectedDate}
      onChange={handleChange}
      onDone={handleDone}
    />
  )

  if (mode == 'PopUp') {
    component = (
      <React.Fragment>
        {props.popUpButton({ toggleOpen })}
        <PickerPopUp
          onClose={toggleOpen}
          isPopUpOpen={isPopUpOpen}
          containerStyle={containerStyle}
        >
          {component}
        </PickerPopUp>
      </React.Fragment>
    )
  }

  // Let's go
  return component
}

DateTimePicker.defaultProps = {
  mode: 'PopUp',
  selectedDate: null,
  isPopUpOpen: false,
  containerStyle: {},
  datePickerModifiers: {}
}

DateTimePicker.propTypes = {
  // Visual Props
  mode: PropTypes.oneOf(['PopUp', 'PickerOnly']),
  popUpButton: PropTypes.func,

  // State Props
  selectedDate: PropTypes.instanceOf(Date),
  isPopUpOpen: PropTypes.bool,

  // Functionality Props
  onDone: PropTypes.func.isRequired,

  // Style & Other props
  containerStyle: PropTypes.object,
  datePickerModifiers: PropTypes.object
}

export default DateTimePicker
