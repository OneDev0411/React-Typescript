import React from 'react'
import DatePicker from 'react-day-picker'

import ActionButton from 'components/Button/ActionButton'
import { Divider } from 'components/Divider'
import TimeInput from 'components/TimeInput'

import { PickerContent } from './styled'
import { dateFallback, pickerSaveButtonText } from './helpers'

function Picker(props) {
  const isDateSet = !!props.selectedDate

  return (
    <PickerContent>
      <DatePicker
        selectedDays={props.selectedDate}
        month={props.selectedDate}
        onDayClick={props.onChange}
        modifiers={props.dateModifiers}
        disabledDays={props.disabledDays}
      />

      {props.hasTime && (
        <React.Fragment>
          <Divider margin="0.5em 0" />
          <TimeInput
            defaultTime={dateFallback(props.selectedDate)}
            onChange={props.onCahnge}
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
