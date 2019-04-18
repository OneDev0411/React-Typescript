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
  const handleChangeDate = date => props.onChange(date)
  const handleChangeTime = time =>
    props.onChange(setTimeStringToDate(props.selectedDate, time))
  const isDateSet = !!props.selectedDate

  return (
    <PickerContent>
      <DatePicker
        selectedDays={props.selectedDate}
        month={props.selectedDate}
        modifiers={props.dateModifiers}
        disabledDays={props.disabledDays}
      />
      <Divider margin="0.5em 0" />
      <TimePicker
        defaultTime={dateFallback(props.selectedDate)}
        onChange={handleChangeTime}
      />
      <Divider margin="0.5em 0" />
      <div className="picker-actions">
        <div>
          {isDateSet && (
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
