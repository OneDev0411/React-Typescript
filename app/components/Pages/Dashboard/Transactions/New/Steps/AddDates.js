// Dashboard/Transactions/New/Steps/AddDates.js
import React, { Component } from 'react'
import { Col, Input } from 'react-bootstrap'
import S from 'shorti'
import DayPickerType from '../Partials/DayPickerType'

export default class AddDates extends Component {

  handleDayClick(date_type, e, day) {
    this.props.selectDay(date_type, day)
  }

  render() {
    // Data
    const data = this.props.data
    const { selected_day } = data.new_transaction
    let contract_date
    let due_diligence_date
    let closing_date
    let contract_date_formatted
    let due_diligence_date_formatted
    let closing_date_formatted
    if (selected_day) {
      contract_date = selected_day.contract
      if (contract_date)
        contract_date_formatted = (contract_date.getMonth() + 1) + '/' + contract_date.getDate() + '/' + contract_date.getFullYear()
      due_diligence_date = selected_day.due_diligence
      if (due_diligence_date)
        due_diligence_date_formatted = (due_diligence_date.getMonth() + 1) + '/' + due_diligence_date.getDate() + '/' + due_diligence_date.getFullYear()
      closing_date = selected_day.closing
      if (closing_date)
        closing_date_formatted = (closing_date.getMonth() + 1) + '/' + closing_date.getDate() + '/' + closing_date.getFullYear()
    }

    return (
      <div>
        <div style={ S('t-100n absolute color-d0d4d9') }>Never leave that till tomorrow which you can do today.</div>
        <div style={ S('mb-40') }>
          <h1>Important Dates</h1>
        </div>
        <div>
          <Col sm={4}>
            <span style={ S('color-777') }>
              CONTRACT
            </span>
            <br/>
            <Input readOnly value={ contract_date_formatted } type="text" />
            <DayPickerType
              handleDayClick={ this.handleDayClick.bind(this) }
              date_selected={ contract_date }
              date_type={ 'contract' }
            />
          </Col>
          <Col sm={4}>
            <span style={ S('color-777') }>
              DUE DILIGENCE
            </span>
            <br/>
            <Input readOnly value={ due_diligence_date_formatted } type="text" />
            <DayPickerType
              handleDayClick={ this.handleDayClick.bind(this) }
              date_selected={ due_diligence_date }
              date_type={ 'due_diligence' }
            />
          </Col>
          <Col sm={4}>
            <span style={ S('color-777') }>
              CLOSING
            </span>
            <br/>
            <Input readOnly value={ closing_date_formatted } type="text" />
            <DayPickerType
              handleDayClick={ this.handleDayClick.bind(this) }
              date_selected={ closing_date }
              date_type={ 'closing' }
            />
          </Col>
        </div>
      </div>
    )
  }
}

// PropTypes
AddDates.propTypes = {
  data: React.PropTypes.object,
  selectDay: React.PropTypes.func
}