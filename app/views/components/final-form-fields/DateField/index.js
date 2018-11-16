import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'
import Flex from 'styled-flex-component'

import { days, months } from 'utils/date-times'

import { Dropdown } from '../../Dropdown'
import Button from '../../Button/ActionButton'

import { Input } from './styled'

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

  render() {
    const { name } = this.props

    return (
      <Flex style={{ width: 'calc(100% - 2.5rem)' }} column>
        <Flex>
          <Field
            name={`${name}.month`}
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
        <Field
          name={`${name}.year`}
          subscription={{ error: true, touched: true }}
          render={({ meta }) =>
            meta.touched && meta.error ? (
              <span style={{ color: '#f00' }}>{meta.error}</span>
            ) : null
          }
        />
      </Flex>
    )
  }
}
