import React, { Component } from 'react'

import { BasicDropdown } from 'components/BasicDropdown'

import { ItemTitle, ItemContainer } from '../styled'

const OPTIONS = [
  {
    label: 'Small',
    value: '8px'
  },
  {
    label: 'Medium',
    value: '16px'
  },
  {
    label: 'Large',
    value: '48px'
  },
  {
    label: 'Huge',
    value: '64px'
  }
]

export default class FontSizePicker extends Component {
  static defaultProps = {
    title: 'Font Size'
  }

  state = {
    value: this.props.value || OPTIONS[1].value
  }

  findSelectedItemByValue = value =>
    OPTIONS.find(item => item.value === value) || OPTIONS[1]

  handleChange = ({ value }) => {
    this.setState({ value })
    this.props.onChange(value)
  }

  render() {
    return (
      <ItemContainer>
        <ItemTitle>{this.props.title}</ItemTitle>
        <BasicDropdown
          fullHeight
          menuStyle={{ width: '100%' }}
          style={{ width: '100%' }}
          selectedItem={this.findSelectedItemByValue(this.state.value)}
          items={OPTIONS}
          onSelect={this.handleChange}
        />
      </ItemContainer>
    )
  }
}
