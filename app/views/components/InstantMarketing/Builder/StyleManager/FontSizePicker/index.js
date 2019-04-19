import React, { Component } from 'react'

import { BasicDropdown } from 'components/BasicDropdown'

import { ItemTitle, ItemContainer } from '../styled'

const MAX_VALUE = 100
const STEP = 2
const DEFAULT_SELECTED_INDEX = 3

const generateFontSizes = (step = STEP, max = MAX_VALUE) => {
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
    value: this.props.value || OPTIONS[DEFAULT_SELECTED_INDEX].value
  }

  findSelectedItemByValue = value =>
    OPTIONS.find(item => item.value === value) ||
    OPTIONS[DEFAULT_SELECTED_INDEX]

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
          centerSelected
        />
      </ItemContainer>
    )
  }
}
