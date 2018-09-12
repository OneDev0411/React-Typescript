import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'
import DayPicker from 'react-day-picker'
import 'react-day-picker/lib/style.css'

import fecha from 'fecha'
import ClickOutSide from 'react-click-outside'

import Card from '../../../components/Card'
import ActionButton from '../../../components/Button/ActionButton'

const formatDate = date => fecha.format(new Date(date), 'MMM D, YYYY HH:MM A')

export class DateTimePicker extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    defaultSelectedDate: PropTypes.shape(),
    datePickerModifiers: PropTypes.shape()
  }

  state = {
    isOpen: false,
    selectedDate: this.props.defaultSelectedDate || new Date()
  }

  handleClose = () =>
    this.setState({ isOpen: false }, () =>
      this.props.onChange(this.state.selectedDate)
    )

  handleOpen = () => this.setState({ isOpen: true })

  handleSelectedDate = selectedDate => {
    this.setState({
      selectedDate
    })
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
              <Card
                depth={3}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 3,
                  zIndex: 1,
                  overflow: 'hidden'
                }}
              >
                <DayPicker
                  initialMonth={selectedDate}
                  selectedDays={selectedDate}
                  onDayClick={this.handleSelectedDate}
                  modifiers={this.props.datePickerModifiers}
                />
              </Card>
            </ClickOutSide>
          )}
        </div>
      </div>
    )
  }
}
