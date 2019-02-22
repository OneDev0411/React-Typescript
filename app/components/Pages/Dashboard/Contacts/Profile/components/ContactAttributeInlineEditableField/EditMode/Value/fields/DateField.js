import React from 'react'
import PropTypes from 'prop-types'

import { DateField as Field } from 'components/DateField'

import {
  DropdownButton,
  DropdownArrowIcon
} from 'components/inline-editable-fields/styled'
import {
  getDateValues,
  parseDateValues
} from 'components/inline-editable-fields/InlineDateField/helpers'

export class DateField extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.number
  }

  static defaultProps = {
    value: 0
  }

  constructor(props) {
    super(props)

    this.state = {
      showYear: false,
      ...getDateValues(props.value)
    }
  }

  onChange = () => this.props.onChange(parseDateValues(this.state))

  onChangeDay = day => this.setState({ day }, this.onChange)

  onChangeMonth = month => this.setState({ month }, this.onChange)

  onChangeYear = year => this.setState({ year }, this.onChange)

  toggleYearOption = showYear => this.setState({ showYear })

  render() {
    return (
      <Field
        {...this.state}
        onChangeDay={this.onChangeDay}
        onChangeYear={this.onChangeYear}
        onChangeMonth={this.onChangeMonth}
        toggleYearOption={this.toggleYearOption}
        dropdownButtonRenderer={buttonProps => (
          <DropdownButton {...buttonProps} isActive={buttonProps.isOpen}>
            {buttonProps.selectedItem.label}
            <DropdownArrowIcon isOpen={buttonProps.isOpen} />
          </DropdownButton>
        )}
      />
    )
  }
}
