import React from 'react'
import DatePicker from 'react-day-picker'
import ClickOutSide from 'react-click-outside'
import Flex from 'styled-flex-component'

import ActionButton from 'components/Button/ActionButton'
import { PickerContainer } from 'components/DateTimePicker/styled'
import { Divider } from 'components/Divider'

export default class extends React.Component {
  state = {
    selectedDate: null
  }

  onDateChange(date) {
    this.setState({
      selectedDate: date
    })
  }

  getSelectedDate() {
    const { initialDate } = this.props
    const { selectedDate } = this.state

    if (selectedDate) {
      return selectedDate
    }

    if (initialDate) {
      return new Date(initialDate)
    }

    return null
  }

  onClose = () => {
    const { onClose } = this.props

    this.setState({ selectedDate: null }, onClose)
  }

  onSelectDate(date) {
    const { onSelectDate } = this.props

    onSelectDate(date)
    this.setState({ selectedDate: null })
  }

  render() {
    const { show, saveText } = this.props
    const { selectedDate } = this.state
    const date = this.getSelectedDate()

    return (
      <div style={{ position: 'relative' }}>
        {show && (
          <ClickOutSide onClickOutside={this.onClose}>
            <PickerContainer depth={3} style={this.props.containerStyle}>
              <DatePicker
                selectedDays={date}
                month={date}
                onDayClick={date => this.onDateChange(date)}
              />
              <Divider margin="0.5em 0" />

              <Flex alignCenter justifyBetween>
                <ActionButton
                  appearance="outline"
                  size="small"
                  style={{ fontWeight: 500 }}
                  onClick={() => this.onClose()}
                >
                  Cancel
                </ActionButton>

                <ActionButton
                  size="small"
                  type="button"
                  onClick={() => this.onSelectDate(selectedDate || date)}
                  disabled={!date}
                  style={{ fontWeight: 500 }}
                >
                  {saveText || 'Update'}
                </ActionButton>
              </Flex>
            </PickerContainer>
          </ClickOutSide>
        )}
      </div>
    )
  }
}
