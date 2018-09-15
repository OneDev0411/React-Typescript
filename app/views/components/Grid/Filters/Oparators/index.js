import React from 'react'

import { DropDownList } from './components/DropDownList'
import { TextInput } from './components/TextInput'
import { Container, Operator, Title, InputContainer } from './styled'
import IconSelectedRadio from '../../../SvgIcons/Radio/SelectedRadio/IconSelectedRadio'
import IconUnSelectedRadio from '../../../SvgIcons/Radio/UnSelectedRadio/IconUnSelectedRadio'

export class FilterOperators extends React.Component {
  constructor(props) {
    super(props)

    this.state = this.DefaultState
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
    const { defaultValue, values = [], onFilterChange } = this.props

    const selectedOperator = this.getOperator()

    if (defaultValue) {
      values.push({
        value: defaultValue
      })
    }

    onFilterChange(values, selectedOperator)

    return {
      selectedOperator
    }
  }

  onOperatorChange = operator => {
    const { selectedOperator } = this.state

    if (selectedOperator && selectedOperator.name === operator.name) {
      return false
    }

    this.setState({ selectedOperator: operator })
    this.props.onFilterChange([], operator)
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
        return <DropDownList {...props} />

      case 'Scalar':
        return <TextInput {...props} />
    }

    return false
  }

  render() {
    const { allowedOperators, type } = this.props
    const { selectedOperator } = this.state

    return (
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
    )
  }
}
