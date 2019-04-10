import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'

import PickerPopUp from './PickerPopUp'
import Picker from './Picker'

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

  const handleRemove = useCallback(() => {
    setDate(null)
    props.onDone(null)
  }, [])

  // Extract needed props
  const { mode, hasRemove, saveButtonText, popUpPosition } = props

  // Which mode?
  let component = (
    <Picker
      selectedDate={selectedDate}
      onChange={handleChange}
      onDone={handleDone}
      hasRemove={hasRemove}
      onRemove={handleRemove}
      saveButtonText={saveButtonText}
      // We don't update the form field value unless the user clicks
      // on save button inside the picker. This is useful for when want to
      // know we are editing a date or we are setting a new date.
      hasInitialDate={!!props.selectedDate}
    />
  )

  if (mode == 'PopUp') {
    component = (
      <React.Fragment>
        {props.popUpButton({ toggleOpen })}
        <PickerPopUp
          onClose={toggleOpen}
          isPopUpOpen={isPopUpOpen}
          popUpPosition={popUpPosition}
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
  saveButtonText: 'Add Date',
  hasRemove: true,
  selectedDate: null,
  isPopUpOpen: false,
  popUpPosition: 'bottom-left',
  datePickerModifiers: {}
}

DateTimePicker.propTypes = {
  // Visual Props
  mode: PropTypes.oneOf(['PopUp', 'PickerOnly']),
  popUpButton: PropTypes.func,
  popUpPosition: PropTypes.string,
  saveButtonText: PropTypes.string,
  hasRemove: PropTypes.bool,

  // State Props
  selectedDate: PropTypes.instanceOf(Date),
  isPopUpOpen: PropTypes.bool,

  // Functionality Props
  onDone: PropTypes.func.isRequired,

  // Other props
  datePickerModifiers: PropTypes.object
}

export default DateTimePicker
