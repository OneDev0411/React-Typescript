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

  render() {
    const { show, initialDate, onClose, onSelectDate } = this.props
    const { selectedDate } = this.state

    return (
      <Modal
        show={show}
        onHide={onClose}
        dialogClassName="modal-deal-date-picker"
      >
        <Modal.Body>
          <DatePicker
            selectedDays={this.getSelectedDate()}
            onDayClick={(date) => this.onDateChange(date)}
          />
        </Modal.Body>

        <Modal.Footer>
          <Button
            className="deal-button cancel"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            className="deal-button"
            onClick={() => onSelectDate(selectedDate)}
          >
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}
