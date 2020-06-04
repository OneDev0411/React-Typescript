import React from 'react'
import DatePicker from 'react-day-picker'
import { Button } from '@material-ui/core'

import { Divider } from 'components/Divider'
import TimeInput from 'components/TimeInput'

import { PickerContent } from './styled'
import { dateFallback, pickerSaveButtonText } from './helpers'

function Picker(props) {
  const isDateSet = !!props.selectedDate
  const handleChangeDate = (date, modifiers) => {
    // An ugly trick for setting correct time
    // because react-day-picker is setting time to 12AM automaticly each time.
    if (isDateSet) {
      // If the date is set before we are using that
      date.setHours(props.selectedDate.getHours())
      date.setMinutes(props.selectedDate.getMinutes())
    } else {
      // if it's not set, we are using current time of user
      const now = new Date()

      date.setHours(now.getHours())
      date.setMinutes(now.getMinutes())
    }

    props.onChange(date, modifiers)
  }
  const handleChangeTime = date => props.onChange(date)

  return (
    <PickerContent>
      <DatePicker
        selectedDays={props.selectedDate}
        month={props.selectedDate}
        onDayClick={handleChangeDate}
        modifiers={props.dateModifiers}
        disabledDays={props.disabledDays}
      />

      {props.hasTime && (
        <>
          <Divider margin="0.5em 0" />
          <TimeInput
            initialDate={dateFallback(props.selectedDate)}
            onChange={handleChangeTime}
          />
        </>
      )}
      {(props.hasDone || props.hasRemove) && (
        <>
          <Divider margin="0.5em 0" />
          <div className="picker-actions">
            <div>
              {props.hasRemove && isDateSet && props.hasInitialDate && (
                <Button
                  variant="text"
                  size="small"
                  onClick={props.onRemove}
                  data-test="date-picker-remove"
                >
                  Remove
                </Button>
              )}
            </div>
            {props.hasDone && (
              <Button
                size="small"
                type="button"
                color="secondary"
                variant="contained"
                onClick={props.onDone}
                disabled={!isDateSet}
                data-test="date-picker-done"
              >
                {pickerSaveButtonText({
                  isDateSet,
                  hasInitialDate: props.hasInitialDate,
                  saveButtonText: props.saveButtonText
                })}
              </Button>
            )}
          </div>
        </>
      )}
    </PickerContent>
  )
}

export default Picker
