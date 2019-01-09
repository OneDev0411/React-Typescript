import React, { Component } from 'react'

import { BasicDropdown } from 'components/BasicDropdown'
import { grey } from 'views/utils/colors'

import Item from './item'

const CONDITIONS = [
  {
    title: 'Match all filters',
    value: 'and'
  },
  {
    title: 'Match any filters',
    value: 'or'
  }
]

export class ConditionOperators extends Component {
  state = {
    selectedItem: CONDITIONS[0]
  }

  handleConditionChange = selectedItem => {
    this.setState(
      {
        selectedItem
      },
      () => {
        this.props.onConditionChange &&
          this.props.onConditionChange(this.state.selectedItem)
      }
    )
  }

  render() {
    return (
      <BasicDropdown
        noBorder
        items={CONDITIONS}
        onChange={this.handleConditionChange}
        menuStyle={{ width: '100%' }}
        itemToString={item => item.title}
        defaultSelectedItem={this.state.selectedItem}
        buttonText={this.state.selectedItem.title}
        style={{
          marginRight: '0.5rem',
          width: '10.7rem'
        }}
        buttonStyle={{
          backgroundColor: `${grey.A150}`
        }}
        itemRenderer={({ item, ...rest }) => (
          <Item title={item.title} {...rest} />
        )}
      />
    )
  }
}
