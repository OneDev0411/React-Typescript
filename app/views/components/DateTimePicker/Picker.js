import React from 'react'
import DatePicker from 'react-day-picker'

import ActionButton from 'components/Button/ActionButton'
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
        <React.Fragment>
          <Divider margin="0.5em 0" />
          <TimeInput
            initialDate={dateFallback(props.selectedDate)}
            onChange={handleChangeTime}
          />
        </React.Fragment>
      )}
      {(props.hasDone || props.hasRemove) && (
        <React.Fragment>
          <Divider margin="0.5em 0" />
          <div className="picker-actions">
            <div>
              {props.hasRemove && isDateSet && props.hasInitialDate && (
                <ActionButton
                  appearance="outline"
                  size="small"
                  style={{ fontWeight: 500 }}
                  onClick={props.onRemove}
                >
                  Remove
                </ActionButton>
              )}
            </div>
            {props.hasDone && (
              <ActionButton
                size="small"
                type="button"
                onClick={props.onDone}
                disabled={!isDateSet}
                style={{ fontWeight: 500 }}
              >
                {pickerSaveButtonText({
                  isDateSet,
                  hasInitialDate: props.hasInitialDate,
                  saveButtonText: props.saveButtonText
                })}
              </ActionButton>
            )}
          </div>
        </React.Fragment>
      )}
    </PickerContent>
  )
}

export default Picker
