import React, { Fragment } from 'react'
import moment from 'moment'
import cn from 'classnames'
import _ from 'underscore'
import DatePicker from '../components/date-picker'
import Input from '../../../../../views/components/Input'
import RequiredIcon from '../../../../../views/components/SvgIcons/Required/IconRequired'
import { H2 } from 'components/Typography/headings'
import ActionButton from 'components/Button/ActionButton'

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
    const value = this.props.contexts[field.name]

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
          <div key={field.name}>
            {field.data_type !== 'Date' && (
              <div className="entity-item string new">
                <div className="add-item text-input">
                  <div>
                    <span
                      className={cn('text', {
                        hasError:
                          hasError &&
                          field.mandatory &&
                          _.isUndefined(contexts[field.name])
                      })}
                    >
                      {field.label}{' '}
                      {areContextsRequired && field.mandatory && <sup>*</sup>}
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
                    value={this.getContextValue(field)}
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

            {field.data_type === 'Date' && (
              <Fragment>
                {contexts[field.name] ? (
                  <ContextValue
                    name={field.label}
                    date={contexts[field.name]}
                    onRemove={() => onChangeContext(field.name, null)}
                    onEdit={() => this.setSelectedField(field.name)}
                  />
                ) : (
                  <div
                    className="entity-item date new"
                    onClick={() => this.setSelectedField(field.name)}
                  >
                    <ActionButton appearance="link" className="add-item">
                      <span className="icon">+</span>
                      <span
                        className={cn('text', {
                          hasError: hasError && field.mandatory
                        })}
                      >
                        {field.label}{' '}
                        {areContextsRequired && field.mandatory && <sup>*</sup>}
                      </span>
                    </ActionButton>
                  </div>
                )}
              </Fragment>
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
