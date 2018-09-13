import React from 'react'
import PropTypes from 'prop-types'
import fecha from 'fecha'

import DayPicker, { DateUtils } from 'react-day-picker'
import Toolbar from './Toolbar'

import ActionButton from '../Button/ActionButton'
import { Container } from './styled'

const initialState = {
  currentDate: new Date()
}

export default class DatePicker extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    fixedWeeks: PropTypes.bool,
    modifiers: PropTypes.object,
    selectedDate: PropTypes.any,
    showTodayButton: PropTypes.bool
  }

  static defaultProps = {
    fixedWeeks: false,
    modifiers: {},
    selectedDate: null,
    showTodayButton: true
  }

  state = initialState

  componentDidMount() {
    this.setDate(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.setDate(nextProps)
  }

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
      this.onChange
    )
  }

  setDate({ selectedDate }) {
    const { currentDate } = this.state

    if (selectedDate && selectedDate.toString() !== currentDate.toString()) {
      this.setState({
        currentDate: selectedDate
      })
    }
  }

  get Date() {
    return this.state.currentDate
  }

  handleToday = () => this.setState(initialState, this.onChange)
  handlePreviousMonth = () => this.addMonths(-1)
  handleNextMonth = () => this.addMonths(1)
  onChange = () => this.props.onChange(this.Date)

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
      this.onChange
    )

  render() {
    return (
      <Container>
        <DayPicker
          month={this.Date}
          selectedDays={this.Date}
          onDayClick={this.handleDayClick}
          fixedWeeks={false}
          canChangeMonth={false}
          modifiers={this.props.modifiers}
          captionElement={({ date, localeUtils }) => (
            <Toolbar
              date={date}
              year={this.Date.getFullYear()}
              month={this.Date.getMonth()}
              localeUtils={localeUtils}
              onDateChange={this.handleDateChange}
              onPreviousClick={this.handlePreviousMonth}
              onNextClick={this.handleNextMonth}
            />
          )}
        />
        {this.props.showTodayButton && (
          <ActionButton
            isBlock
            type="button"
            appearance="outline"
            onClick={this.handleToday}
            data-balloon={fecha.format(new Date(), 'dddd, MMMM DD')}
            data-balloon-pos="down"
          >
            Today
          </ActionButton>
        )}
      </Container>
    )
  }
}
