import React from 'react'

import { DropDownList } from './components/DropDownList'
import { TextInput } from './components/TextInput'
import { Container, Operator, Input, Title } from './styled'

export class FilterOperators extends React.Component {
  constructor(props) {
    super(props)

    this.state = this.DefaultState
  }

  getOperator = () => {
    const { operators, currentOperator } = this.props

    return (
      currentOperator ||
      Object.values(operators).find(
        operator => operator.defaultSelected === true
      ) ||
      operators[0]
    )
  }

  get DefaultState() {
    const { defaultValue, currentFilters, onFilterChange } = this.props

    const selectedOperator = this.getOperator()

    if (defaultValue && !currentFilters) {
      onFilterChange(
        defaultValue ? [{ name: defaultValue, value: defaultValue }] : [],
        selectedOperator
      )
    }

    return {
      selectedOperator
    }
  }

  onOperatorChange = operator => {
    const { selectedOperator } = this.state

    if (selectedOperator && selectedOperator.id === operator.id) {
      return false
    }

    this.setState({ selectedOperator: operator })
    this.props.onFilterChange([], operator)
  }

  onFilterChange = filters =>
    this.props.onFilterChange(_.values(filters), this.state.selectedOperator)

  getOperatorComponent = componentType => {
    const props = {
      ...this.props,
      onFilterChange: this.onFilterChange
    }

    switch (componentType) {
      case 'List':
        return <DropDownList {...props} />

      case 'Text':
        return <TextInput {...props} />
    }

    return false
  }

  render() {
    const { operators } = this.props
    const { selectedOperator } = this.state

    return (
      <Container>
        {operators.map(item => (
          <Operator key={item.id} onClick={() => this.onOperatorChange(item)}>
            <Input
              type="radio"
              name="operator"
              onChange={() => null}
              value={item.id}
              checked={selectedOperator && selectedOperator.id === item.id}
            />
            <Title>{item.name}</Title>
            <div>
              {selectedOperator &&
                selectedOperator.id === item.id &&
                this.getOperatorComponent(item.componentType)}
            </div>
          </Operator>
        ))}
      </Container>
    )
  }
}
