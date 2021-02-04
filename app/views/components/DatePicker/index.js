import React from 'react'
import PropTypes from 'prop-types'

import DayPicker, { DateUtils } from 'react-day-picker'

import Toolbar from './Toolbar'

import { Container } from './styled'

export default class DatePicker extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      currentDate:
        props.selectedDate !== undefined ? props.selectedDate : new Date()
    }
  }

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    fixedWeeks: PropTypes.bool,
    modifiers: PropTypes.object,
    selectedDate: PropTypes.any
  }

  static defaultProps = {
    fixedWeeks: false,
    modifiers: {},
    selectedDate: null
  }

  componentDidMount() {
    this.setDate(this.props)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setDate(nextProps)
  }

  dayPickerRef = React.createRef()

  handleDateChange = (name, value) => {
    const date = {
      year: this.Date.getFullYear(),
      month: this.Date.getMonth(),
      day: 1,
      [name]: value
    }

    this.setState(
      {
        currentDate: new Date(date.year, date.month, date.day)
      },
      () => this.onChange(name)
    )
  }

  setDate({ selectedDate }) {
    const { currentDate } = this.state

    if (selectedDate && selectedDate.toString() !== currentDate.toString()) {
      this.setState(
        {
          currentDate: selectedDate
        },
        () => (this.dayPickerRef.current.state.currentMonth = selectedDate)
      )
    }
  }

  get Date() {
    return this.state.currentDate
  }

  handlePreviousMonth = () => this.addMonths(-1)

  handleNextMonth = () => this.addMonths(1)

  onChange = (type = 'day') => this.props.onChange(this.Date, type)

  handleDayClick = currentDate =>
    this.setState(
      {
        currentDate
      },
      this.onChange
    )

  addMonths = count =>
    this.setState(
      {
        currentDate: DateUtils.addMonths(this.Date, count)
      },
      () => this.onChange('month')
    )

  render() {
    return (
      <Container>
        <DayPicker
          month={this.Date}
          selectedDays={this.Date}
          onDayClick={this.handleDayClick}
          fixedWeeks={this.props.fixedWeeks}
          canChangeMonth={false}
          modifiers={this.props.modifiers}
          ref={this.dayPickerRef}
          captionElement={({ date, localeUtils }) => (
            <Toolbar
              date={date}
              year={this.Date?.getFullYear()}
              month={this.Date?.getMonth()}
              localeUtils={localeUtils}
              onDateChange={this.handleDateChange}
              onPreviousClick={this.handlePreviousMonth}
              onNextClick={this.handleNextMonth}
            />
          )}
        />
      </Container>
    )
  }
}
