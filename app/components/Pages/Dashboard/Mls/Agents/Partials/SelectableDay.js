import React from 'react'
import moment from 'moment'
import { Input } from 'react-bootstrap'
import DayPicker, { DateUtils } from 'react-day-picker'

export default class InputField extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      value: '',
      month: new Date(), // The month to display in the calendar
      showCalendar: false
    }
  }

  handleInputChange(e) {
    const { value } = e.target

    // Change the current month only if the value entered by the user is a valid
    // date, according to the `L` format
    if (moment(value, 'll', true).isValid()) {
      this.setState({
        month: moment(value, 'll').toDate(),
        value
      }, this.showCurrentDate)
    }
    else
      this.setState({ value }, this.showCurrentDate)
  }

  handleDayClick(e, day) {
    this.setState({
      value: moment(day).format('ll'),
      month: day
    })

    this.setState({ showCalendar: false })
  }

  handleBlur(e) {
    if (e.relatedTarget && (e.relatedTarget.classList.contains('DayPicker-Day') || e.relatedTarget.classList.contains('DayPicker')))
      return false

    this.setState({ showCalendar: false })
  }

  handleFocus() {
    this.refs.daypicker.showMonth(this.state.month)
    this.setState({ showCalendar: true })
  }

  render() {
    const selectedDay = moment(this.state.value, 'll', true).toDate()

    const calendarStyle = {
      position: 'absolute',
      display: this.state.showCalendar ? 'block' : 'none',
      backgroundColor: 'white',
      border: '1px solid #eee',
      marginTop: '-50px',
      marginLeft: '100px'
    }

    return (
      <div>
        <Input
          bsSize="small"
          ref="input"
          type="text"
          value={ this.state.value }
          placeholder="like 'Sep 4, 2013'"
          onChange={ this.handleInputChange.bind(this) }
          onFocus={ this.handleFocus.bind(this) }
          onBlur={ this.handleBlur.bind(this) }
        />

        <div style={ calendarStyle }>
          <DayPicker
            ref="daypicker"
            initialMonth={ this.state.month }
            modifiers={{
              selected: day => DateUtils.isSameDay(selectedDay, day)
            }}
            onDayClick={ this.handleDayClick.bind(this) }
          />
        </div>
      </div>
    )
  }

}