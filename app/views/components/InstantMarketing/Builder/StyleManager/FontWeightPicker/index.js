import React, { Component } from 'react'

import { BasicDropdown } from 'components/BasicDropdown'

import { ItemTitle, ItemContainer } from '../styled'

// regular, medium, semibold, bold, extra-bold
const OPTIONS = [
  {
    label: 'Regular',
    value: '300'
  },
  {
    label: 'Bold',
    value: '900'
  }
]

export default class FontSizePicker extends Component {
  static defaultProps = {
    title: 'Font Weight'
  }

  state = {
    value: this.props.value || OPTIONS[0].value
  }

  findSelectedItemByValue = value =>
    OPTIONS.find(item => item.value === value) || OPTIONS[0]

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
