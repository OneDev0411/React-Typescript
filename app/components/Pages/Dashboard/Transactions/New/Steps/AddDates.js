// Dashboard/Transactions/New/Steps/AddDates.js
import React, { Component } from 'react'
import { Col, FormControl, Button, Modal } from 'react-bootstrap'
import S from 'shorti'
import DayPickerType from '../Partials/DayPickerType'

export default class AddDates extends Component {

  handleDayClick(date_type, e, day) {
    this.props.selectDay(date_type, day)
  }

  formatDate(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const formatted_date = {
      day: days[date.getDay()],
      date: date.getDate(),
      month: months[date.getMonth()],
      year: date.getFullYear()
    }
    return formatted_date
  }

  render() {
    // Data
    const data = this.props.data
    const new_transaction = data.new_transaction
    const show_date_picker = new_transaction.show_date_picker
    const date_type_key = new_transaction.date_type_key
    const { selected_day } = new_transaction
    let contract_date
    let due_diligence_date
    let closing_date
    let contract_date_formatted
    let due_diligence_date_formatted
    let closing_date_formatted
    if (selected_day) {
      contract_date = selected_day.contract
      if (contract_date)
        contract_date_formatted = this.formatDate(contract_date)
      due_diligence_date = selected_day.due_diligence
      if (due_diligence_date)
        due_diligence_date_formatted = this.formatDate(due_diligence_date)
      closing_date = selected_day.closing
      if (closing_date)
        closing_date_formatted = this.formatDate(closing_date)
    }
    let date_type_title
    if (date_type_key === 'contract')
      date_type_title = 'Contract'
    if (date_type_key === 'due_diligence')
      date_type_title = 'Due Diligence'
    if (date_type_key === 'closing')
      date_type_title = 'Closing'

    const year_style = {
      borderBottom: '1px solid #e8ebef',
      paddingBottom: 5,
      marginBottom: 15,
      width: 200
    }
    return (
      <div style={S('minw-1000')}>
        <div style={S('t-100n absolute color-d0d4d9')}>Never leave that till tomorrow which you can do today.</div>
        <div style={S('mb-70')}>
          <h1>Important Dates</h1>
        </div>
        <div>
          <Col sm={4} style={S('pl-0')}>
            <div style={S('color-bfc2c3 font-13 mb-10')}>
              EXECUTED DATE
            </div>
            <div>
              <div style={S('font-28 color-a1bde4')}>{ contract_date_formatted ? contract_date_formatted.day.toUpperCase() : '' }</div>
              <div style={S('font-28 color-a1bde4 mb-10')}>{ contract_date_formatted ? contract_date_formatted.month.toUpperCase() : '' } { contract_date_formatted ? contract_date_formatted.date : '' }</div>
              <div style={{ ...year_style, ...S('color-a1bde4') }}>{ contract_date_formatted ? contract_date_formatted.year : '' }</div>
              <div>
                <Button bsStyle="primary" onClick={this.props.showDatePickerModal.bind(this, 'contract')}>Change</Button>
              </div>
            </div>
            <FormControl readOnly value={contract_date_formatted} type="hidden" />
          </Col>
          <Col sm={4} style={S('pl-0')}>
            <div style={S('color-bfc2c3 font-13 mb-10')}>
              OPTION PERIOD ENDS
            </div>
            <div>
              <div style={S('font-28 color-828c99')}>{ due_diligence_date_formatted ? due_diligence_date_formatted.day.toUpperCase() : '' }</div>
              <div style={S('font-28 color-828c99 mb-10')}>{ due_diligence_date_formatted ? due_diligence_date_formatted.month.toUpperCase() : '' } { due_diligence_date_formatted ? due_diligence_date_formatted.date : '' }</div>
              <div style={{ ...year_style, ...S('color-828c99') }}>{ due_diligence_date_formatted ? due_diligence_date_formatted.year : '' }</div>
              <div>
                <Button bsStyle="primary" onClick={this.props.showDatePickerModal.bind(this, 'due_diligence')}>Change</Button>
              </div>
            </div>
            <FormControl readOnly value={due_diligence_date_formatted} type="hidden" />
          </Col>
          <Col sm={4} style={S('pl-0')}>
            <div style={S('color-bfc2c3 font-13 mb-10')}>
              CLOSING DATE
            </div>
            <div>
              <div style={S('font-28 color-db3821')}>{ closing_date_formatted ? closing_date_formatted.day.toUpperCase() : '' }</div>
              <div style={S('font-28 color-db3821 mb-10')}>{ closing_date_formatted ? closing_date_formatted.month.toUpperCase() : '' } { closing_date_formatted ? closing_date_formatted.date : '' }</div>
              <div style={{ ...year_style, ...S('color-db3821') }}>{ closing_date_formatted ? closing_date_formatted.year : '' }</div>
              <div>
                <Button bsStyle="primary" onClick={this.props.showDatePickerModal.bind(this, 'closing')}>Change</Button>
              </div>
            </div>
            <FormControl readOnly value={closing_date_formatted} type="hidden" />
          </Col>
          <Modal show={show_date_picker} onHide={this.props.hideModal.bind(this)}>
            <Modal.Header closeButton>
              <Modal.Title>Select { date_type_title } Date</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <DayPickerType
                handleDayClick={this.handleDayClick.bind(this)}
                date_selected={closing_date}
                date_type={date_type_key}
              />
            </Modal.Body>
          </Modal>
        </div>
      </div>
    )
  }
}

// PropTypes
AddDates.propTypes = {
  data: React.PropTypes.object,
  selectDay: React.PropTypes.func,
  hideModal: React.PropTypes.func,
  showDatePickerModal: React.PropTypes.func
}
