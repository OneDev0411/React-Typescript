import React from 'react'
import PropTypes from 'prop-types'
import DayPicker from 'react-day-picker'
import ClickOutSide from 'react-click-outside'

import { getTime } from '../../../utils/get-time'
import { setTime } from '../../../utils/set-time'

import { Divider } from '../Divider'
import { TimePicker } from '../TimePicker'
import ActionButton from '../Button/ActionButton'

import { PickerContainer } from './styled'
import { today, formatDate, setTimeStringToDate } from './helpers'

export class DateTimePicker extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    defaultSelectedDate: PropTypes.instanceOf(Date),
    datePickerModifiers: PropTypes.shape()
  }

  state = {
    isOpen: false,
    selectedDate: this.props.defaultSelectedDate || today
  }

  handleClose = () => this.setState({ isOpen: false })

  handleOpen = () => this.setState({ isOpen: true })

  handleDate = date =>
    this.setState(state => {
      const currentTime = getTime(new Date(state.selectedDate).getTime())

      return { selectedDate: setTime(date, currentTime) }
    }, this.props.onChange(this.state.selectedDate))

  handleTime = time =>
    this.setState(
      state => ({
        selectedDate: setTimeStringToDate(state.selectedDate, time)
      }),
      this.props.onChange(this.state.selectedDate)
    )

  render() {
    const { selectedDate } = this.state

    return (
      <div style={this.props.style}>
        <ActionButton
          type="button"
          appearance="link"
          onClick={this.handleOpen}
          onFocus={this.handleOpen}
          style={{ fontWeight: 500 }}
        >
          {formatDate(selectedDate)}
        </ActionButton>
        <div style={{ position: 'relative' }}>
          {this.state.isOpen && (
            <ClickOutSide onClickOutside={this.handleClose}>
              <PickerContainer depth={3}>
                <DayPicker
                  initialMonth={selectedDate}
                  selectedDays={selectedDate}
                  onDayClick={this.handleDate}
                  modifiers={this.props.datePickerModifiers}
                />
                <Divider marginTop="0.5em" marginBottom="0.5em" />
                <TimePicker
                  defaultTime={selectedDate}
                  onChange={this.handleTime}
                />
              </PickerContainer>
            </ClickOutSide>
          )}
        </div>
      </div>
    )
  }
}
