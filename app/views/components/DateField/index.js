import React from 'react'

import PropTypes from 'prop-types'
import Flex from 'styled-flex-component'

import { BasicDropdown } from 'components/BasicDropdown'
import Button from 'components/Button/ActionButton'
import { days, months } from 'utils/date-times'

import { Input } from './styled'

const daysItems = days.map(day => ({
  label: day < 10 ? `0${day}` : day.toString(),
  value: day
}))
const monthsItems = months.map((month, index) => ({
  label: month,
  value: index
}))

export class DateField extends React.Component {
  static propTypes = {
    day: PropTypes.shape().isRequired,
    month: PropTypes.shape().isRequired,
    year: PropTypes.any,
    onChangeDay: PropTypes.func.isRequired,
    onChangeMonth: PropTypes.func.isRequired,
    onChangeYear: PropTypes.func,
    showYear: PropTypes.bool,
    toggleYearOption: PropTypes.func
  }

  static defaultProps = {
    showYear: false,
    onChangeYear() {},
    toggleYearOption() {},
    year: ''
  }

  onChangeYear = event => {
    const { value } = event.target

    if (!value || /^\d+$/.test(value)) {
      this.props.onChangeYear(value)
    }
  }

  render() {
    const { props } = this
    const display = 'flex'

    return (
      <Flex data-test="date-field">
        <BasicDropdown
          items={monthsItems}
          onChange={props.onChangeMonth}
          selectedItem={props.month}
          style={{ display }}
          buttonRenderer={props.dropdownButtonRenderer}
        />
        <BasicDropdown
          items={daysItems}
          selectedItem={props.day}
          onChange={props.onChangeDay}
          style={{ display, margin: '0 0.5rem 0' }}
          buttonRenderer={props.dropdownButtonRenderer}
        />
        {props.showYear ? (
          <Input
            type="text"
            autoComplete="disabled"
            placeholder="Year"
            maxLength="4"
            onChange={this.onChangeYear}
            value={props.year || ''}
          />
        ) : (
          <Button appearance="link" onClick={props.toggleYearOption}>
            + Add Year
          </Button>
        )}
      </Flex>
    )
  }
}
