import React, { Component } from 'react'
import styled from 'styled-components'

import { BasicDropdown } from 'components/BasicDropdown'
import { CheckBoxButton } from 'components/Button/CheckboxButton'

import IconBell from 'components/SvgIcons/Bell/IconBell'

import { DropButton, IconDrop } from './styled'

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

  handleChange = () => {
    console.log(this.state)
    this.props.onChange(this.state)
  }

  checkboxChangeHandler = () => {
    this.setState(
      prevState => ({
        ...prevState,
        checked: !prevState.checked
      }),
      this.handleChange
    )
  }

  dropdownChangeHandler = ({ value }) => {
    this.setState({ value }, this.handleChange)
  }

  findOptionByValue = (options, value) =>
    options.find(item => item.value === value)

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
          &nbsp;&nbsp;<span>{label}</span>
        </CheckBoxContainer>
        <BasicDropdown
          fullHeight
          items={options}
          defaultSelectedItem={
            this.findOptionByValue(options, value) || options[0]
          }
          buttonIcon={IconBell}
          onChange={this.dropdownChangeHandler}
          buttonRenderer={props => (
            <DropButton
              {...props}
              inverse
              style={{ paddingLeft: 0, width: '11rem' }}
            >
              <IconBell />
              {this.findOptionByValue(options, this.state.value).label}
              <IconDrop
                isOpen={props.isOpen}
                style={{ margin: '0.25rem 0 0 0.25rem' }}
              />
            </DropButton>
          )}
        />
      </Container>
    )
  }
}
