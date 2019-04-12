import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types'

import ConfirmationModalContext from 'components/ConfirmationModal/context'

import PickerPopUp from './PickerPopUp'
import Picker from './Picker'

function DateTimePicker(props) {
  // State
  const [selectedDate, setDate] = useState(props.initialSelectedDate)
  const [isPopUpOpen, setOpen] = useState(props.initialIsPopUpOpen)

  // Contexts
  const modal = useContext(ConfirmationModalContext)

  // Callbacks
  const toggleOpen = () => {
    if (isPopUpOpen && props.initialSelectedDate !== selectedDate) {
      modal.setConfirmationModal({
        message: 'Heads up!',
        // eslint-disable-next-line
        description: "You didn't save your selected date. Are you sure?",
        onConfirm: () => {
          setOpen(!isPopUpOpen)

          // When we are closing modal, we should reset the state
          // to the initial value because next time user is opening the modal,
          // he should see the initial time as selected date not the last one
          // that he did not save.
          setDate(props.initialSelectedDate)
        }
      })
    } else {
      setOpen(!isPopUpOpen)
    }
  }

  const handleChange = date => setDate(date)

  const handleDone = () => {
    if (!selectedDate) {
      return false
    }

    // Trigger handler
    props.onDone(selectedDate)

    // Close PopUp
    setOpen(false)
  }

  const handleRemove = () => {
    setDate('')
    props.onDone('')
  }

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
  initialSelectedDate: null,
  initialIsPopUpOpen: false,
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
  initialSelectedDate: PropTypes.instanceOf(Date),
  initialIsPopUpOpen: PropTypes.bool,

  // Functionality Props
  onDone: PropTypes.func.isRequired,

  // Other props
  datePickerModifiers: PropTypes.object
}

export default DateTimePicker
