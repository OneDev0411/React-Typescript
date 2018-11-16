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
    name: PropTypes.string.isRequired,
    required: PropTypes.bool
  }

  static defaultProps = {
    yearIsOptional: false,
    required: false
  }

  state = {
    showYear: !this.props.yearIsOptional
  }

  handleAddYear = () => this.setState({ showYear: true })

  render() {
    const { name } = this.props

    return (
      <Flex>
        <Field
          name={`${name}.month`}
          render={fieldProps => (
            <Dropdown
              noBorder
              input={fieldProps.input}
              items={monthsItems}
              style={{ margin: '0 0 0 0.5rem' }}
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
          format={value =>
            value == null
              ? ''
              : Number.isNaN(value)
                ? Number(value.toString().replace(/[^0-9]/g, ''))
                : value
          }
          render={({ input }) =>
            this.state.showYear || input.value ? (
              <Input {...input} type="text" placeholder="Year" maxLength="4" />
            ) : (
              <Button appearance="link" onClick={this.handleAddYear}>
                + Add Year
              </Button>
            )
          }
        />
      </Flex>
    )
  }
}
