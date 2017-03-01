// Dashboard/Tasks/Partials/DayTimePicker.js
import React, { Component } from 'react'
import S from 'shorti'
import { Button, FormControl } from 'react-bootstrap'
import DayPicker, { DateUtils } from 'react-day-picker'

export default class DayTimePicker extends Component {

  handleSaveDateTime() {
    const hours = this.hoursInput.value
    const minutes = this.minutesInput.value
    const suffix = this.suffixInput.value
    this.props.handleSaveDateTime(hours, minutes, suffix)
  }

  render() {
    const date_seconds = this.props.date_seconds
    const date_obj = new Date(date_seconds * 1000)
    const hour = date_obj.getHours()
    const current_minutes = date_obj.getMinutes()
    let current_suffix = 'AM'
    let current_hour = hour
    if (hour === 0) {
      current_hour = 12
      current_suffix = 'AM'
    }
    if (hour > 12) {
      current_hour = parseInt(current_hour, 10) - 12
      current_suffix = 'PM'
    }
    if (hour === 12)
      current_suffix = 'PM'
    return (
      <div className="daypicker--tasks" style={ S('absolute bg-fff z-100 l-10') }>
        <DayPicker
          modifiers={{
            selected: day => DateUtils.isSameDay(date_obj, day)
          }}
          onDayClick={ this.props.handleSetDate.bind(this) }
        />
        <div style={ S('w-200 pl-10 pb-10 font-12') }>
          TIME
          <div className="clearfix"></div>
          <div style={ S('w-60 pull-left') }>
            <FormControl defaultValue={ current_hour } inputRef={ ref => this.hoursInput = ref } type="number" max={ 12 } min={ 1 }/>
          </div>
          <div style={ S('w-60 pull-left') }>
            <FormControl defaultValue={ current_minutes } inputRef={ ref => this.minutesInput = ref } type="number" max={ 59 } min={ 1 }/>
          </div>
          <div style={ S('w-60 pull-left') }>
            <FormControl defaultValue={ current_suffix } inputRef={ ref => this.suffixInput = ref } type="select">
              <option value={ 'AM' }>AM</option>
              <option value={ 'PM' }>PM</option>
            </FormControl>
          </div>
        </div>
        <div style={ S('p-10') }>
          <a onClick={ this.props.hideDayPicker.bind(this) } href="#" className="pull-left" style={ S('mt-10') }>Cancel</a>
          <Button onClick={ this.handleSaveDateTime.bind(this) } className="pull-right" bsStyle="primary" type="button">Select</Button>
          <div className="clearfix"></div>
        </div>
        <div className="clearfix"></div>
      </div>
    )
  }
}

// PropTypes
DayTimePicker.propTypes = {
  data: React.PropTypes.object,
  date_seconds: React.PropTypes.number,
  hideDayPicker: React.PropTypes.func,
  handleSetDate: React.PropTypes.func,
  handleSaveDateTime: React.PropTypes.func
}
