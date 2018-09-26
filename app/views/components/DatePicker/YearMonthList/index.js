import React from 'react'

import { Container } from './styled'
import { BasicDropdown } from '../../BasicDropdown'

function itemToString(item) {
  return item.label
}

class YearMonthList extends React.Component {
  constructor(props) {
    super(props)
    this.defaultYear = this.Years.findIndex(year => year.value === props.year)
    this.defaultMonth = this.Months.findIndex(
      month => month.value === props.month
    )
  }
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
      label: `${base - number}`
    }))
  }

  changeDate = (name, value) => this.props.onDateChange(name, value)

  render() {
    const { children, onPreviousClick, onNextClick } = this.props

    const Years = this.Years
    const Months = this.Months

    return (
      <Container className="DayPicker-Caption">
        <BasicDropdown
          noBorder
          isBlock={false}
          buttonSize="small"
          defaultSelectedItem={Months[this.defaultMonth]}
          items={this.Months}
          itemToString={itemToString}
          onChange={item => this.changeDate('month', item.value)}
          style={{
            display: 'inline-block',
            minWidth: '50px',
            marginLeft: '-0.5rem'
          }}
          menuStyle={{ fontSize: '1rem' }}
        />
        <BasicDropdown
          noBorder
          isBlock={false}
          buttonSize="small"
          defaultSelectedItem={Years[this.defaultYear]}
          items={Years}
          itemToString={itemToString}
          onChange={item => this.changeDate('year', item.value)}
          style={{
            display: 'inline-block',
            minWidth: '50px'
          }}
          menuStyle={{ fontSize: '1rem' }}
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
