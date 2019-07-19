import React, { Component } from 'react'

import { BasicDropdown } from 'components/BasicDropdown'
import { CheckBoxButton } from 'components/Button/CheckboxButton'

import IconBell from 'components/SvgIcons/Bell/IconBell'

import { Container, CheckBoxContainer, DropButton, IconDrop } from './styled'

export default class Item extends Component {
  state = {
    checked: this.props.value >= 0
  }

  componentDidUpdate(_prevProps, prevState) {
    const checked = this.props.value >= 0

    if (checked !== prevState.checked) {
      this.handleComponentUpdate()
    }
  }

  handleComponentUpdate() {
    this.setState({ checked: this.props.value >= 0 })
  }

  handleChange = value => {
    this.props.onChange({
      type: this.state.checked ? 'add' : 'remove',
      setting: {
        object_type: this.props.type,
        event_type: this.props.name,
        reminder: value
      }
    })
  }

  checkboxChangeHandler = () => {
    this.setState(
      prevState => ({
        ...prevState,
        checked: !prevState.checked
      }),
      () => {
        const value = this.props.value || this.props.options[0].value

        this.handleChange(value)
      }
    )
  }

  dropdownChangeHandler = ({ value }) => {
    this.handleChange(value)
  }

  findOptionByValue = (options, value) =>
    options.find(item => item.value === value)

  render() {
    const { label, value, options } = this.props
    const { checked } = this.state
    const selectedItem = this.findOptionByValue(options, value) || options[0]

    return (
      <Container>
        <CheckBoxContainer onClick={this.checkboxChangeHandler}>
          <CheckBoxButton
            onClick={this.checkboxChangeHandler}
            isSelected={checked}
            square
          />
          &nbsp;&nbsp;<span>{label}</span>
        </CheckBoxContainer>

        <BasicDropdown
          disabled={!checked}
          fullHeight
          items={options}
          selectedItem={selectedItem}
          buttonIcon={IconBell}
          onSelect={this.dropdownChangeHandler}
          menuStyle={{
            width: '11rem'
          }}
          buttonRenderer={props => (
            <DropButton
              {...props}
              inverse
              style={{ paddingLeft: 0, width: '11rem' }}
            >
              <IconBell />
              {selectedItem.label}
              <IconDrop
                disabled={!checked}
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
