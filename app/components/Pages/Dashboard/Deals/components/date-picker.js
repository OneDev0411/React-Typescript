import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import DatePicker from 'react-day-picker'
import moment from 'moment'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedDate: null
    }
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

  onSelectDate() {
    const { onSelectDate } = this.props
    const { selectedDate } = this.state

    onSelectDate(selectedDate)
    this.setState({ selectedDate: null })
  }

  render() {
    const { show, saveText, initialDate } = this.props
    const { selectedDate } = this.state
    const date = this.getSelectedDate()

    if (!show) {
      return false
    }

    return (
      <Modal
        show
        onHide={() => this.onClose()}
        dialogClassName="modal-deal-date-picker"
        backdrop="static"
      >
        <Modal.Body>
          <DatePicker
            selectedDays={date}
            month={date}
            onDayClick={(date) => this.onDateChange(date)}
          />
        </Modal.Body>

        <Modal.Footer>
          <Button
            className="deal-button cancel"
            onClick={() => this.onClose()}
          >
            Cancel
          </Button>

          <Button
            className="deal-button"
            onClick={() => this.onSelectDate(selectedDate)}
            disabled={!date}
          >
            { saveText || 'Update' }
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}
