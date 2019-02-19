import React, { Component } from 'react'

import { BasicDropdown } from 'components/BasicDropdown'

import { ItemTitle, ItemContainer } from '../styled'

const OPTIONS = [
  {
    label: '4',
    value: '4px'
  },
  {
    label: '8',
    value: '8px'
  },
  {
    label: '16',
    value: '16px'
  },
  {
    label: '24',
    value: '24px'
  },
  {
    label: '32',
    value: '32px'
  },
  {
    label: '40',
    value: '40px'
  },
  {
    label: '48',
    value: '48px'
  },
  {
    label: '56',
    value: '56px'
  },
  {
    label: '64',
    value: '64px'
  }
]

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
