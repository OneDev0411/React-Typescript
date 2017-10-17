import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import DatePicker from 'react-day-picker'

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

  render() {
    const { show, onClose, onSelectDate } = this.props
    const { selectedDate } = this.state

    return (
      <Modal
        show={show}
        onHide={onClose}
        dialogClassName="modal-deal-date-picker"
      >
        <Modal.Body>
          <DatePicker
            selectedDays={selectedDate}
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
