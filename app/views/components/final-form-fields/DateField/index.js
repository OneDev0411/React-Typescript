import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'
import Flex from 'styled-flex-component'

import { days, months } from 'utils/date-times'

import { Dropdown } from '../../Dropdown'
import Button from '../../Button/ActionButton'

import { Input } from './styled'

const getValidateFields = name =>
  ['month', 'day', 'year'].map(n => `${name}.${n}`)

const daysItems = days.map(day => ({
  title: day < 10 ? `0${day}` : day.toString(),
  value: day
}))
const monthsItems = months.map((month, index) => ({
  title: month,
  value: index
}))

export class DateField extends React.Component {
  static propTypes = {
    yearIsOptional: PropTypes.bool,
    name: PropTypes.string.isRequired
  }

  static defaultProps = {
    yearIsOptional: false
  }

  state = {
    showYear: !this.props.yearIsOptional
  }

  handleAddYear = () => this.setState({ showYear: true })

  validateSelect = (meta, allValues, parentName) => {
    const { name, value } = meta
    if (!value) {
      return
    }

    const fieldName = name.substring(name.indexOf('.') + 1)
    let parent = allValues[parentName]
    const startingBracketIndex = parentName.indexOf('[')
    
    if (!parent && startingBracketIndex !== -1) {
      const id = parentName.substring(0, startingBracketIndex)
      const index = parentName.substring(startingBracketIndex + 1, parentName.indexOf(']'))
      parent = allValues[id][Number(index)]
    }

    // console.log(fieldName, meta, allValues, parent)
    let siblingName = 'day'
    if (fieldName === siblingName) {
      siblingName = 'month'
    }
    const siblingValue = parent[siblingName] && parent[siblingName].value

    if (value.value == null && (siblingValue != null || parent.year)) {
      return `${value.title} is required!`
    }
  }

  render() {
    const { name } = this.props
    const validateFields = getValidateFields(name)

    return (
      <Flex style={{ width: 'calc(100% - 2.5rem)' }} column>
        <Flex>
          <Field
            name={`${name}.month`}
            validate={(item, allValues, meta) =>
              this.validateSelect(meta, allValues, name)
            }
            validateFields={validateFields}
            render={fieldProps => (
              <Dropdown
                noBorder
                input={fieldProps.input}
                items={monthsItems}
                style={{ margin: '0 0.5rem 0 0' }}
                buttonStyle={{ padding: 0 }}
              />
            )}
          />
          <Field
            name={`${name}.day`}
            validateFields={validateFields}
            validate={(item, allValues, meta) =>
              this.validateSelect(meta, allValues, name)
            }
            render={fieldProps => (
              <Dropdown
                noBorder
                input={fieldProps.input}
                items={daysItems}
                style={{ margin: 0 }}
                buttonStyle={{ padding: 0 }}
              />
            )}
          />
          <Field
            name={`${name}.year`}
            validateFields={validateFields}
            parse={value => {
              if (value == null || Number.isNaN(value)) {
                return ''
              }

              const r = value.toString().replace(/[^0-9]/g, '')

              return r ? Number(r) : ''
            }}
            validate={value => {
              if (!value && !this.props.yearIsOptional) {
                return 'Year is Required!'
              }

              if (
                value &&
                (value < 1800 || value > new Date().getUTCFullYear())
              ) {
                return 'Invalid Year!'
              }
            }}
            render={({ input, meta }) =>
              this.state.showYear || input.value || meta.dirty ? (
                <Input
                  {...input}
                  type="text"
                  autoComplete="off"
                  placeholder="Year"
                  maxLength="4"
                />
              ) : (
                <Button appearance="link" onClick={this.handleAddYear}>
                  + Add Year
                </Button>
              )
            }
          />
        </Flex>
        {validateFields.map((name, index) => (
          <Field
            key={index}
            name={name}
            subscription={{ error: true, touched: true }}
            render={({ meta }) =>
              meta.touched && meta.error ? (
                <div style={{ color: '#f00' }}>{meta.error}</div>
              ) : null
            }
          />
        ))}
      </Flex>
    )
  }
}
