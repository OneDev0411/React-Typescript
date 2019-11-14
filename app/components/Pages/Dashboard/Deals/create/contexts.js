import React from 'react'
import moment from 'moment'
import cn from 'classnames'
import _ from 'underscore'

import { H2 } from 'components/Typography/headings'

import { DateTimePicker } from 'components/DateTimePicker'

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
  onChangeDateContext(field, date) {
    this.props.onChangeContext(field, date)
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
              <DateTimePicker
                saveCaption="Save Date"
                showTimePicker={false}
                selectedDate={
                  contexts[field.key]
                    ? new Date(contexts[field.key])
                    : new Date()
                }
                onClose={date => this.onChangeDateContext(field.key, date)}
              >
                {({ handleOpen }) => (
                  <div
                    className="entity-item date new"
                    style={{
                      marginLeft: '1rem'
                    }}
                  >
                    <>
                      {contexts[field.key] ? (
                        <ContextValue
                          name={field.label}
                          date={contexts[field.key]}
                          onRemove={() => onChangeContext(field.key, null)}
                          onEdit={handleOpen}
                        />
                      ) : (
                        <div className="add-item" onClick={handleOpen}>
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
                        </div>
                      )}
                    </>
                  </div>
                )}
              </DateTimePicker>
            )}
          </div>
        ))}
      </div>
    )
  }
}
