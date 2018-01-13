import React from 'react'
import moment from 'moment'
import cn from 'classnames'
import Context from '../../../../../models/DealContext'
import RadioButton from '../components/radio'
import DatePicker from '../components/date-picker'

const ContextValue = ({ name, date, onRemove, onEdit }) => (
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

  onChangeDateContext(date) {
    const { selectedField } = this.state

    this.props.onChangeContext(selectedField, date)
    this.cancelEditing()
  }

  onChangeStringContext(field, date) {
    this.props.onChangeContext(field, date)
  }

  render() {
    const { contexts, fields, onChangeContext } = this.props
    const { selectedField } = this.state

    return (
      <div className="form-section contexts">
        <div className="hero">
          Do you know any of these critical dates?
        </div>

        {
          _.map(fields, field => (
            <div key={field.name}>
              {
                field.data_type !== 'Date' &&
                <div
                  className="entity-item string new"
                >
                  <div className="add-item text-input">
                    <div>
                      <span className="icon">+</span>
                      <span className="text">
                        {field.label} {field.mandatory && <sup>*</sup>}
                      </span>
                    </div>

                    <input
                      className={cn({
                        invalid: contexts[field.name] &&
                          !Context.validate(field, contexts[field.name])
                      })}
                      type={field.data_type}
                      value={contexts[field.name] || ''}
                      onChange={e => this.onChangeStringContext(field.name, e.target.value)}
                    />
                  </div>
                </div>
              }

              {
                contexts[field.name] && field.data_type === 'Date' &&
                <ContextValue
                  name={field.label}
                  date={contexts[field.name]}
                  onRemove={() => onChangeContext(field.name, null)}
                  onEdit={() => this.setSelectedField(field.name)}
                />
              }

              {
                !contexts[field.name] && field.data_type === 'Date' &&
                <div
                  className="entity-item date new"
                  onClick={() => this.setSelectedField(field.name)}
                >
                  <div className="add-item">
                    <span className="icon">+</span>
                    <span className="text">
                      {field.label} {field.mandatory && <sup>*</sup>}
                    </span>
                  </div>
                </div>
              }
            </div>
          ))
        }

        <DatePicker
          show={selectedField !== null}
          saveText={contexts[selectedField] ? 'Update Date' : 'Add Date'}
          initialDate={contexts[selectedField]}
          onClose={() => this.cancelEditing()}
          onSelectDate={date => this.onChangeDateContext(date)}
        />
      </div>
    )
  }
}
