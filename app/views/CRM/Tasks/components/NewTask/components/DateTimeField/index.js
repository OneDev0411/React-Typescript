import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'

import Error from './components/Error'
import { Item } from '../DropdownItem'
import { Dropdown } from '../../../../../../components/Dropdown'
import DateField from './components/DateField'

const defaultProps = {
  isRequired: false
}

const propTypes = {
  isRequired: PropTypes.bool,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
}

class DateTimeField extends React.Component {
  render() {
    const {
      id,
      name,
      title,
      dateItems,
      timeItems,
      isRequired,
      selectedDate,
      datePickerModifiers,
      defaultSelectedDate,
      defaultSelectedTime
    } = this.props

    return (
      <Error
        name={`${name}Time`}
        className={`c-new-task__date-time--${id} c-new-task__field`}
      >
        <label
          htmlFor={`c-new-task__${id}`}
          className="c-new-task__field__label"
        >
          {title}
          {isRequired && <b style={{ color: 'red' }}> *</b>}
        </label>
        <div className="c-new-task__date-time__inputs">
          <Field
            items={dateItems}
            name={`${name}Date`}
            component={DateField}
            id={`new-task__${id}`}
            datePickerModifiers={datePickerModifiers}
            defaultSelectedItem={defaultSelectedDate}
          />
          {selectedDate.value && (
            <Field
              items={timeItems}
              name={`${name}Time`}
              component={Dropdown}
              itemToString={({ title }) => title}
              defaultSelectedItem={defaultSelectedTime}
              itemRenderer={({ item, ...props }) => (
                <Item key={item.value} {...props}>
                  {item.title}
                </Item>
              )}
            />
          )}
        </div>
      </Error>
    )
  }
}

DateTimeField.propTypes = propTypes
DateTimeField.defaultProps = defaultProps

export default DateTimeField
