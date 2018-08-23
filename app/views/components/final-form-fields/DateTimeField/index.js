import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'

import { ErrorField } from '../ErrorField'
import { Dropdown } from '../../Dropdown'

import { DateField } from '../DateField'
import { Label, FieldsWrapper } from './styled'

DateTimeField.propTypes = {
  defaultSelectedDate: PropTypes.shape(),
  datePickerModifiers: PropTypes.shape(),
  dateItems: PropTypes.arrayOf(PropTypes.shape()),
  id: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
  name: PropTypes.string.isRequired,
  timeItems: PropTypes.arrayOf(PropTypes.shape()),
  title: PropTypes.string.isRequired
}
DateTimeField.defaultProps = {
  dateItems: [],
  isRequired: false,
  timeItems: []
}

export function DateTimeField(props) {
  const { id, name, selectedDate } = props

  return (
    <div
      style={{
        padding: '0 1em',
        borderBottom: '1px solid #dde5ec'
      }}
    >
      <ErrorField name={`${name}Time`}>
        <Label htmlFor={id}>
          {props.title}
          {props.isRequired && <b style={{ color: 'red' }}> *</b>}
        </Label>
        <FieldsWrapper>
          <Field
            component={DateField}
            defaultSelectedItem={props.defaultSelectedDate}
            datePickerModifiers={props.datePickerModifiers}
            id={id}
            items={props.dateItems}
            name={`${name}Date`}
          />
          {selectedDate &&
            selectedDate.value && (
              <Field
                component={Dropdown}
                items={props.timeItems}
                itemToString={({ title }) => title}
                name={`${name}Time`}
              />
            )}
        </FieldsWrapper>
      </ErrorField>
    </div>
  )
}
