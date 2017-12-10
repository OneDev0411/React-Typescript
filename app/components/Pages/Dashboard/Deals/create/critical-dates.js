import React from 'react'
import moment from 'moment'
import RadioButton from '../components/radio'
import DatePicker from '../components/date-picker'

const CriticalValue = ({ name, date, onRemove, onEdit }) => (
  <div className="selected-field">
    { name }:&nbsp;
    <span className="date" onClick={onEdit}>{ moment(date).format('MMMM DD, YYYY') }</span>
    <span className="splitter">|</span>
    <span className="remove" onClick={onRemove}>Remove date</span>
  </div>
)

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedField: null
    }
  }

  setSelectedField(field) {
    this.setState({
      selectedField: field
    })
  }

  cancelEditing() {
    this.setSelectedField(null)
  }

  changeCriticalDate(date) {
    const { selectedField } = this.state
    this.props.onChangeCriticalDates(selectedField, date)
    this.cancelEditing()
  }

  render() {
    const { criticalDates, fields, onChangeCriticalDates } = this.props
    const { selectedField } = this.state

    return (
      <div className="form-section critical-dates">
        <div className="hero">
          Do you know any of these critical dates?
        </div>

        {
          _.map(fields, (name, key) => (
            <div key={key}>
              {
                criticalDates[key] ?
                <CriticalValue
                  name={name}
                  date={criticalDates[key]}
                  onRemove={() => onChangeCriticalDates(key, null)}
                  onEdit={() => this.setSelectedField(key)}
                /> :
                <div
                  className="entity-item date new"
                  style={{ marginBottom: 0 }}
                  onClick={() => this.setSelectedField(key)}
                >
                  <div className="add-item">
                    <span className="icon">+</span>
                    <span className="text">{ name }</span>
                  </div>
                </div>
              }
            </div>
          ))
        }

        <DatePicker
          show={selectedField !== null}
          saveText={criticalDates[selectedField] ? 'Update Date' : 'Add Date'}
          initialDate={criticalDates[selectedField]}
          onClose={() => this.cancelEditing()}
          onSelectDate={date => this.changeCriticalDate(date)}
        />
      </div>
    )
  }
}
