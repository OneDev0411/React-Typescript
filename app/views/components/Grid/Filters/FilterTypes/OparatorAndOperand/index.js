import React, { Fragment } from 'react'

import PropTypes from 'prop-types'
import { mdiRadioboxBlank, mdiRadioboxMarked } from '@mdi/js'

import { DoneButton } from 'components/Grid/Filters/Item/styled'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

import { DropDownList } from './components/DropDownList'
import { TextInput } from './components/TextInput'
import {
  Container,
  InputContainer,
  Operator,
  Title,
  MarkedIcon
} from './styled'

import getOperator from './get-operator'

export const operators = [
  {
    name: 'is',
    default: true
  },
  {
    name: 'is not',
    invert: true
  }
]

const propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })
  ),
  getOptions: PropTypes.func,
  type: PropTypes.string,
  allowedOperators: PropTypes.arrayOf(PropTypes.string)
}

const defaultProps = {
  options: [],
  getOptions: null,
  type: 'Set',
  allowedOperators: operators
}

export class OperatorAndOperandFilter extends React.Component {
  state = {
    selectedOperator: getOperator(this.props)
  }

  async componentDidMount() {
    if (typeof this.props.getOptions === 'function') {
      this.setState({ options: await this.props.getOptions() })
    }
  }

  onOperatorChange = operator => {
    const { selectedOperator } = this.state
    const { values = [] } = this.props

    if (selectedOperator && selectedOperator.name === operator.name) {
      return false
    }

    this.setState({ selectedOperator: operator })
    this.props.onFilterChange(values, operator)
  }

  onFilterChange = filters =>
    this.props.onFilterChange(
      Object.values(filters),
      this.state.selectedOperator
    )

  getOperatorComponent = type => {
    const props = {
      ...this.props,
      onFilterChange: this.onFilterChange
    }

    switch (type) {
      case 'Set':
        return (
          <DropDownList
            {...props}
            options={this.state.options || this.props.options}
          />
        )

      case 'Scalar':
        return <TextInput {...props} />
    }

    return false
  }

  render() {
    const { allowedOperators, type } = this.props
    const { selectedOperator } = this.state

    return (
      <Fragment>
        <Container>
          {allowedOperators.map((item, index) => (
            <Operator key={index} onClick={() => this.onOperatorChange(item)}>
              <InputContainer>
                {selectedOperator && selectedOperator.name === item.name ? (
                  <MarkedIcon
                    path={mdiRadioboxMarked}
                    size={muiIconSizes.small}
                  />
                ) : (
                  <SvgIcon path={mdiRadioboxBlank} size={muiIconSizes.small} />
                )}
                <Title>{item.name}</Title>
              </InputContainer>
              <div>
                {selectedOperator &&
                  selectedOperator.name === item.name &&
                  this.getOperatorComponent(type)}
              </div>
            </Operator>
          ))}
        </Container>
        <DoneButton
          disabled={!this.props.values || this.props.values.length === 0}
          appearance="link"
          onClick={this.props.onToggleFilterActive}
          data-test="filter-done-button"
        >
          Done
        </DoneButton>
      </Fragment>
    )
  }
}

OperatorAndOperandFilter.propTypes = propTypes
OperatorAndOperandFilter.defaultProps = defaultProps
