import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types'

import ConfirmationModalContext from 'components/ConfirmationModal/context'

import PickerPopUp from './PickerPopUp'
import Picker from './Picker'

DateTimePicker.defaultProps = {
  mode: 'PopUp',
  saveButtonText: 'Add Date',
  hasDone: true,
  hasRemove: true,
  hasTime: true,
  initialSelectedDate: null,
  initialIsPopUpOpen: false,
  popUpPosition: 'bottom-left',
  dateModifiers: {},
  disabledDays: {}
}

DateTimePicker.propTypes = {
  // Visual Props
  mode: PropTypes.oneOf(['PopUp', 'PickerOnly']),
  popUpButton: PropTypes.func,
  saveButtonText: PropTypes.string,
  hasDone: PropTypes.bool,
  hasRemove: PropTypes.bool,
  hasTime: PropTypes.bool,
  popUpPosition: PropTypes.oneOf([
    'top-left',
    'top-right',
    'bottom-left',
    'bottom-right'
  ]),

  // State Props
  initialSelectedDate: PropTypes.instanceOf(Date),
  initialIsPopUpOpen: PropTypes.bool,

  // Functionality Props
  onDone: PropTypes.func.isRequired,

  // Other props
  disabledDays: PropTypes.shape(),
  dateModifiers: PropTypes.shape()
}

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

  const handleChange = (date, modifiers = {}) => {
    if (modifiers.disabled) {
      return
    }

    setDate(date)

    if (!props.hasTime || !props.hasDone) {
      // Close PopUp
      setOpen(false)

      // Trigger onDone when there is no Done button.
      if (!props.hasDone) {
        props.onDone(date)
      }
    }
  }

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

  // Which mode?
  let component = (
    <Picker
      disabledDays={props.disabledDays}
      hasDone={props.hasDone}
      hasTime={props.hasTime}
      hasRemove={props.hasRemove}
      selectedDate={selectedDate}
      onChange={handleChange}
      onDone={handleDone}
      onRemove={handleRemove}
      saveButtonText={props.saveButtonText}
      dateModifiers={props.dateModifiers}
      // We don't update the form field value unless the user clicks
      // on save button inside the picker. This is useful for when want to
      // know we are editing a date or we are setting a new date.
      hasInitialDate={!!props.initialSelectedDate}
    />
  )

  if (props.mode == 'PopUp') {
    component = (
      <>
        {props.popUpButton({ toggleOpen, selectedDate })}
        <PickerPopUp
          onClose={toggleOpen}
          isPopUpOpen={isPopUpOpen}
          popUpPosition={props.popUpPosition}
        >
          {component}
        </PickerPopUp>
      </>
    )
  }

  // Let's go
  return component
}

export default DateTimePicker
