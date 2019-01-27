import React, { Fragment, Component } from 'react'
import styled from 'styled-components'

import { BasicDropdown } from 'components/BasicDropdown'
import { CheckBoxButton } from 'views/components/Button/CheckboxButton'
import IconBell from 'views/components/SvgIcons/Bell/IconBell'

const Container = styled.div`
  margin-bottom: 1.5rem;
`

const CheckBoxContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  &:last-child {
    margin-left: 0.2rem;
  }
`

export default class Item extends Component {
  state = {
    checked: !!this.props.value,
    value: this.props.options[0].value
  }

  handleChange() {
    this.props.onChange(this.state)
  }

  checkboxChangeHandler = () => {
    this.setState(
      prevState => ({
        ...prevState,
        checked: !prevState.checked
      }),
      () => this.handleChange()
    )
  }

  dropdownChangeHandler = value => {
    console.log(value)
  }

  render() {
    const { label, name, type, value, options, onChange } = this.props

    return (
      <Container>
        <CheckBoxContainer onClick={this.checkboxChangeHandler}>
          <CheckBoxButton
            onClick={this.checkboxChangeHandler}
            isSelected={this.state.checked}
            square
          />
          <span>{label}</span>
        </CheckBoxContainer>
        <BasicDropdown
          // noBorder
          buttonSize="small"
          items={options}
          defaultSelectedItem={options[0]}
          buttonIcon={IconBell}
          onChange={this.dropdownChangeHandler}
          buttonText={
            (options.find(item => item.value === value) || options[0]).label
          }
        />
      </Container>
    )
  }
}
