import React from 'react'
import moment from 'moment'
import cn from 'classnames'
import _ from 'underscore'
import DatePicker from '../components/date-picker'
import Input from '../../../../../views/components/Input'

const ContextValue = ({ name, date, onRemove, onEdit }) => (
  <div className="selected-field">
    {name}:&nbsp;
    <span className="date" onClick={onEdit}>
      {moment(date).format('MMMM DD, YYYY')}
    </span>
    <span className="splitter">|</span>
    <span className="remove" onClick={onRemove}>
      Remove date
    </span>
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

  onChangeStringContext(field, value) {
    this.props.onChangeContext(field, value)
  }

  render() {
    const { hasError, contexts, fields, onChangeContext } = this.props
    const { selectedField } = this.state

    return (
      <div className="form-section contexts">
        <div className={cn('hero no-margin-bottom', { hasError })}>
          Please provide the following information:&nbsp;
        </div>

        <div className="hero-description">
          Those marked with an <span className="required">*</span> are required.
        </div>

        {_.map(fields, field => (
          <div key={field.name}>
            {field.data_type !== 'Date' && (
              <div className="entity-item string new">
                <div className="add-item text-input">
                  <div>
                    <span
                      className={cn('text', {
                        hasError:
                          hasError && field.mandatory && !contexts[field.name]
                      })}
                    >
                      {field.label} {field.mandatory && <sup>*</sup>}
                    </span>
                  </div>
                  <Input
                    data-type={field.format || field.data_type}
                    name={field.name}
                    {...field.properties}
                    className={cn({
                      invalid:
                        contexts[field.name] &&
                        !field.validate(field, contexts[field.name])
                    })}
                    value={contexts[field.name] || ''}
                    onChange={(e, data = {}) =>
                      this.onChangeStringContext(
                        field.name,
                        !_.isUndefined(data.value) ? data.value : e.target.value
                      )
                    }
                  />
                </div>
              </div>
            )}

            {contexts[field.name] &&
              field.data_type === 'Date' && (
                <ContextValue
                  name={field.label}
                  date={contexts[field.name]}
                  onRemove={() => onChangeContext(field.name, null)}
                  onEdit={() => this.setSelectedField(field.name)}
                />
              )}

            {!contexts[field.name] &&
              field.data_type === 'Date' && (
                <div
                  className="entity-item date new"
                  onClick={() => this.setSelectedField(field.name)}
                >
                  <div className="add-item">
                    <span className="icon">+</span>
                    <span
                      className={cn('text', {
                        hasError: hasError && field.mandatory
                      })}
                    >
                      {field.label} {field.mandatory && <sup>*</sup>}
                    </span>
                  </div>
                </div>
              )}
          </div>
        ))}

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
