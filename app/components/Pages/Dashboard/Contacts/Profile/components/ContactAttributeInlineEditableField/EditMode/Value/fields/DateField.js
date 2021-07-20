import React from 'react'

import PropTypes from 'prop-types'

import { DateField as Field } from 'components/DateField'
import { getDateValues } from 'components/inline-editable-fields/InlineDateField/helpers'
import {
  DropdownButton,
  DropdownArrowIcon
} from 'components/inline-editable-fields/styled'

export class DateField extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.number
  }

  static defaultProps = {
    value: 0
  }

  state = getDateValues(this.props.value)

  onChange = () => this.props.onChange(this.state)

  onChangeDay = day => this.setState({ day }, this.onChange)

  onChangeMonth = month => this.setState({ month }, this.onChange)

  onChangeYear = year => this.setState({ year }, this.onChange)

  render() {
    return (
      <Field
        {...this.state}
        showYear
        onChangeDay={this.onChangeDay}
        onChangeYear={this.onChangeYear}
        onChangeMonth={this.onChangeMonth}
        dropdownButtonRenderer={buttonProps => (
          <DropdownButton
            {...buttonProps}
            isActive={buttonProps.isOpen}
            style={{ marginBottom: 0 }}
          >
            {buttonProps.selectedItem.label}
            <DropdownArrowIcon isOpen={buttonProps.isOpen} />
          </DropdownButton>
        )}
      />
    )
  }
}
