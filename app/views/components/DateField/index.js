import React from 'react'
import PropTypes from 'prop-types'
import Flex from 'styled-flex-component'

import { days, months } from 'utils/date-times'
import Button from 'components/Button/ActionButton'
import { BasicDropdown } from 'components/BasicDropdown'

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

  onChangeYear = e => this.props.onChangeYear(e.target.value)

  render() {
    const { props } = this

    return (
      <Flex>
        <BasicDropdown
          items={monthsItems}
          onChange={props.onChangeMonth}
          selectedItem={props.month}
          buttonRenderer={props.dropdownButtonRenderer}
        />
        <BasicDropdown
          items={daysItems}
          selectedItem={props.day}
          onChange={props.onChangeDay}
          style={{ margin: '0 0.5rem 0' }}
          buttonRenderer={props.dropdownButtonRenderer}
        />
        {props.showYear ? (
          <Input
            type="text"
            autoComplete="off"
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
