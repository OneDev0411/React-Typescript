import React from 'react'
import { Modal } from 'react-bootstrap'
import DatePicker from 'react-day-picker'
import ActionButton from 'views/components/Button/ActionButton'

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

  onClose() {
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
      <Modal
        show={show}
        onHide={() => this.onClose()}
        dialogClassName="modal-deal-date-picker"
        backdrop="static"
      >
        <Modal.Body>
          <DatePicker
            selectedDays={date}
            month={date}
            onDayClick={date => this.onDateChange(date)}
          />
        </Modal.Body>

        <Modal.Footer>
          <ActionButton
            appearance="outline"
            style={{
              marginRight: '1em'
            }}
            onClick={() => this.onClose()}
          >
            Cancel
          </ActionButton>

          <ActionButton
            onClick={() => this.onSelectDate(selectedDate || date)}
            disabled={!date}
          >
            {saveText || 'Update'}
          </ActionButton>
        </Modal.Footer>
      </Modal>
    )
  }
}
