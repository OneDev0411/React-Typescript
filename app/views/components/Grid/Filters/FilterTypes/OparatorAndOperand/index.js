import React, { Fragment } from 'react'

import PropTypes from 'prop-types'

import { DoneButton } from 'components/Grid/Filters/Item/styled'

import { DropDownList } from './components/DropDownList'
import { TextInput } from './components/TextInput'
import { Container, InputContainer, Operator, Title } from './styled'
import IconSelectedRadio from '../../../../SvgIcons/Radio/SelectedRadio/IconSelectedRadio'
import IconUnSelectedRadio from '../../../../SvgIcons/Radio/UnSelectedRadio/IconUnSelectedRadio'

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

export class OperatorAndOperandFilter extends React.Component {
  constructor(props) {
    super(props)

    this.state = this.DefaultState
  }

  async componentDidMount() {
    if (typeof this.props.getOptions === 'function') {
      this.setState({ options: await this.props.getOptions() })
    }
  }

  getOperator = () => {
    const { allowedOperators, operator } = this.props

    return (
      operator ||
      Object.values(allowedOperators).find(
        operator => operator.default === true
      ) ||
      allowedOperators[0]
    )
  }

  get DefaultState() {
    return {
      selectedOperator: this.getOperator()
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
    this.props.onFilterChange(_.values(filters), this.state.selectedOperator)

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
                  <IconSelectedRadio />
                ) : (
                  <IconUnSelectedRadio />
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
        >
          Done
        </DoneButton>
      </Fragment>
    )
  }
}

OperatorAndOperandFilter.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })
  ),
  getOptions: PropTypes.func,
  type: PropTypes.string,
  multi: PropTypes.bool,
  allowedOperators: PropTypes.arrayOf(PropTypes.string)
}

OperatorAndOperandFilter.defaultProps = {
  options: [],
  getOptions: null,
  type: 'Set',
  multi: false,
  allowedOperators: operators
}
