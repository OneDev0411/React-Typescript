import React, { Component } from 'react'

import { BasicDropdown } from 'components/BasicDropdown'

import { ItemTitle, ItemContainer } from '../styled'

const OPTIONS = [
  {
    label: 'Light',
    value: 'lighter'
  },
  {
    label: 'Normal',
    value: 'normal'
  },
  {
    label: 'Bold',
    value: 'bold'
  }
]

export default class FontSizePicker extends Component {
  static defaultProps = {
    title: 'Font Weight'
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
          menuStyle={{ width: '100%', fontSize: '1rem' }}
          style={{ width: '100%' }}
          selectedItem={this.findSelectedItemByValue(this.state.value)}
          items={OPTIONS}
          onSelect={this.handleChange}
        />
      </ItemContainer>
    )
  }
}
