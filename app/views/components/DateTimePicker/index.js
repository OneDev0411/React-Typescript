import React from 'react'
import PropTypes from 'prop-types'
import DayPicker from 'react-day-picker'
import ClickOutSide from 'react-click-outside'
import Flex from 'styled-flex-component'

import { getTime } from '../../../utils/get-time'
import { setTime } from '../../../utils/set-time'

import { Divider } from '../Divider'
import { TimePicker } from '../TimePicker'
import ActionButton from '../Button/ActionButton'

import { PickerContainer } from './styled'
import { isToday, formatDate, setTimeStringToDate } from './helpers'

export class DateTimePicker extends React.Component {
  static propTypes = {
    datePickerModifiers: PropTypes.shape(),
    onChange: PropTypes.func.isRequired,
    selectedDate: PropTypes.instanceOf(Date)
  }

  static defaultProps = {
    datePickerModifiers: {},
    selectedDate: new Date()
  }

  state = {
    isOpen: false
  }

  handleClose = () => this.setState({ isOpen: false })

  handleOpen = () => this.setState({ isOpen: true })

  handleDate = date =>
    this.props.onChange(setTime(date, getTime(this.props.selectedDate)))

  handleTime = time =>
    this.props.onChange(setTimeStringToDate(this.props.selectedDate, time))

  render() {
    const { selectedDate } = this.props

    return (
      <div style={this.props.style}>
        <ActionButton
          type="button"
          appearance="link"
          onClick={this.handleOpen}
          onFocus={this.handleOpen}
          style={{ fontWeight: 500 }}
        >
          {isToday(selectedDate) && <span>Today,&nbsp;</span>}
          <span>{formatDate(selectedDate)}</span>
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
                <Divider margin="0.5em 0" />
                <Flex alignCenter justifyBetween>
                  <TimePicker
                    defaultTime={selectedDate}
                    onChange={this.handleTime}
                  />
                  <ActionButton
                    type="button"
                    appearance="link"
                    onClick={this.handleClose}
                    style={{ fontWeight: 500 }}
                  >
                    Done
                  </ActionButton>
                </Flex>
              </PickerContainer>
            </ClickOutSide>
          )}
        </div>
      </div>
    )
  }
}
