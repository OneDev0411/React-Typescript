// Dashboard/Transactions/New/Partials/DayPickerType.js
import React, { Component } from 'react'
import DayPicker, { DateUtils } from 'react-day-picker'

export default class DayPickerType extends Component {

  render() {
    return (
      <DayPicker
        modifiers={{
          selected: day => DateUtils.isSameDay(this.props.date_selected, day)
        }}
        onDayClick={this.props.handleDayClick.bind(this, this.props.date_type)}
      />
    )
  }
}

// PropTypes
DayPickerType.propTypes = {
  date_selected: React.PropTypes.object,
  date_type: React.PropTypes.string,
  handleDayClick: React.PropTypes.func
}