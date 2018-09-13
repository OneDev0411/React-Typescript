import React from 'react'
import PropTypes from 'prop-types'
import DayPicker from 'react-day-picker'

import fecha from 'fecha'
import ClickOutSide from 'react-click-outside'

import ActionButton from '../../Button/ActionButton'
import { PickerContainer } from './styled'

const formatDate = date => fecha.format(date, 'MMM D, YYYY HH:MM A')

export class DateTimePicker extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    defaultSelectedDate: PropTypes.instanceOf(Date),
    datePickerModifiers: PropTypes.shape()
  }

  state = {
    isOpen: false,
    selectedDate: this.props.defaultSelectedDate || new Date()
  }

  handleClose = () => this.setState({ isOpen: false })

  handleOpen = () => this.setState({ isOpen: true })

  handleSelectedDate = selectedDate => {
    this.setState(
      () => ({ selectedDate, isOpen: false }),
      () => this.props.onChange(this.state.selectedDate)
    )
  }

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
                  onDayClick={this.handleSelectedDate}
                  modifiers={this.props.datePickerModifiers}
                />
              </PickerContainer>
            </ClickOutSide>
          )}
        </div>
      </div>
    )
  }
}
