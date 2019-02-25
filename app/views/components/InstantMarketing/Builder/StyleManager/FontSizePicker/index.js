import React, { Component } from 'react'

import { BasicDropdown } from 'components/BasicDropdown'

import { ItemTitle, ItemContainer } from '../styled'

const generateFontSizes = (step = 2, max = 100) => {
  const result = []

  for (let i = 2; i <= max; i += step) {
    const label = `${i}`
    const value = `${i}px`

    result.push({ label, value })
  }

  return result
}

const OPTIONS = generateFontSizes()

export default class FontSizePicker extends Component {
  static defaultProps = {
    title: 'Font Size'
  }

  state = {
    value: this.props.value || OPTIONS[2].value
  }

  findSelectedItemByValue = value =>
    OPTIONS.find(item => item.value === value) || OPTIONS[2]

  handleChange = ({ value }) => {
    this.setState({ value })
    this.props.onChange(value)
  }

  render() {
    return (
      <ItemContainer>
        <ItemTitle>{this.props.title}</ItemTitle>
        <BasicDropdown
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
