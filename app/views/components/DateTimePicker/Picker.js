import React from 'react'
import DatePicker from 'react-day-picker'

import ActionButton from 'components/Button/ActionButton'
import { Divider } from 'components/Divider'
import { TimePicker } from 'components/TimePicker'

import { PickerContent } from './styled'
import {
  setTimeStringToDate,
  dateFallback,
  pickerSaveButtonText
} from './helpers'

function Picker(props) {
  const isDateSet = !!props.selectedDate
  const handleChangeDate = date => {
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

    props.onChange(date)
  }
  const handleChangeTime = time =>
    props.onChange(setTimeStringToDate(props.selectedDate, time))

  return (
    <PickerContent>
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
      <div className="picker-actions">
        <div>
          {isDateSet && props.hasInitialDate && (
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
      </div>
    </PickerContent>
  )
}

export default Picker
