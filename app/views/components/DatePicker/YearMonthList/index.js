import React from 'react'

import DropDownList from '../DropDownList'
import { Container } from './styled'

class YearMonthList extends React.Component {
  get Months() {
    return this.props.localeUtils.getMonths().map((name, index) => ({
      value: index,
      label: name
    }))
  }

  get Years() {
    const base = 2025

    return [...Array(75).keys()].map(number => ({
      value: base - number,
      label: base - number
    }))
  }

  changeDate = (name, value) => this.props.onDateChange(name, value)

  render() {
    const { children, year, month, onPreviousClick, onNextClick } = this.props

    return (
      <Container className="DayPicker-Caption">
        <DropDownList
          placeholder="Month"
          options={this.Months}
          selectedValue={month}
          onChange={item => this.changeDate('month', item.value)}
        />

        <DropDownList
          placeholder="Year"
          options={this.Years}
          selectedValue={year}
          onChange={item => this.changeDate('year', item.value)}
        />

        {React.cloneElement(children, {
          onPreviousClick,
          onNextClick
        })}
      </Container>
    )
  }
}

export default YearMonthList
