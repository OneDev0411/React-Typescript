import React, { Fragment } from 'react'
import moment from 'moment'
import cn from 'classnames'
import _ from 'underscore'

import { H2 } from 'components/Typography/headings'

import ActionButton from 'components/Button/ActionButton'

import DatePicker from '../components/DatePicker'
import Input from '../../../../../views/components/Input'
import RequiredIcon from '../../../../../views/components/SvgIcons/Required/IconRequired'

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
  state = {
    selectedField: null
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

  getContextValue(field) {
    const value = this.props.contexts[field.key]

    return !_.isUndefined(value) ? value : ''
  }

  render() {
    const {
      areContextsRequired,
      hasError,
      contexts,
      fields,
      onChangeContext
    } = this.props
    const { selectedField } = this.state

    return (
      <div className="form-section contexts">
        <H2 className={cn('hero', { hasError })}>
          Please provide the following information:&nbsp;
          {hasError && <RequiredIcon />}
        </H2>

        {areContextsRequired && (
          <div className="hero-description">
            Those marked with an <span className="required">*</span> are
            required.
          </div>
        )}

        {_.map(fields, field => (
          <div key={field.key}>
            {field.data_type !== 'Date' && (
              <div className="entity-item string new">
                <div className="add-item text-input">
                  <div>
                    <span
                      className={cn('text', {
                        hasError:
                          hasError &&
                          !field.validate(field, contexts[field.key])
                      })}
                    >
                      {field.label}{' '}
                      {areContextsRequired && field.mandatory && (
                        <span className="required">*</span>
                      )}
                    </span>
                  </div>
                  <Input
                    data-type={field.format || field.data_type}
                    name={field.key}
                    {...field.properties}
                    className={cn({
                      invalid:
                        contexts[field.key] &&
                        !field.validate(field, contexts[field.key])
                    })}
                    value={this.getContextValue(field)}
                    onChange={(e, data = {}) =>
                      this.onChangeStringContext(
                        field.key,
                        !_.isUndefined(data.value) ? data.value : e.target.value
                      )
                    }
                  />
                </div>
              </div>
            )}

            {field.data_type === 'Date' && (
              <Fragment>
                {contexts[field.key] ? (
                  <ContextValue
                    name={field.label}
                    date={contexts[field.key]}
                    onRemove={() => onChangeContext(field.key, null)}
                    onEdit={() => this.setSelectedField(field.key)}
                  />
                ) : (
                  <div
                    className="entity-item date new"
                    onClick={() => this.setSelectedField(field.key)}
                  >
                    <ActionButton appearance="link" className="add-item">
                      <span className="icon">+</span>
                      <span
                        className={cn('text', {
                          hasError: hasError && field.mandatory
                        })}
                      >
                        {field.label}{' '}
                        {areContextsRequired && field.mandatory && (
                          <span className="required">*</span>
                        )}
                      </span>
                    </ActionButton>
                  </div>
                )}
                <DatePicker
                  show={selectedField === field.key}
                  saveText={
                    contexts[selectedField] ? 'Update Date' : 'Add Date'
                  }
                  initialDate={contexts[selectedField]}
                  onClose={() => this.cancelEditing()}
                  onSelectDate={date => this.onChangeDateContext(date)}
                />
              </Fragment>
            )}
          </div>
        ))}
      </div>
    )
  }
}
