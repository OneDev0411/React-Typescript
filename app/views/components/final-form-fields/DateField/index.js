import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'
import Flex from 'styled-flex-component'

import { days, months } from 'utils/date-times'

import { Dropdown } from '../../Dropdown'
import Button from '../../Button/ActionButton'

const getItems = items => items.map(value => ({ title: value, value }))

const daysItems = getItems(days)
const monthsItems = getItems(months)

export class DateField extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    required: PropTypes.bool
  }

  static defaultProps = {
    required: false
  }

  state = {
    showYear: false
  }

  handleAddYear = () => this.setState({ showYear: true })

  render() {
    const { name } = this.props

    return (
      <Flex>
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
          name={`${name}.year`}
          render={({ input }) =>
            this.state.showYear || input.value ? (
              <input
                {...input}
                type="text"
                placeholder="Year"
                style={{ border: '1px solid #d4d4d4', margin: '0 0 0 0.5rem' }}
              />
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
