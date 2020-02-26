import React from 'react'

import { BasicDropdown } from 'components/BasicDropdown'

import Item from './item'

const MENU_OPTIONS = [
  {
    title: 'Match all filters',
    value: 'and'
  },
  {
    title: 'Match any filters',
    value: 'or'
  }
]

export function ConditionOperators(props) {
  return (
    <BasicDropdown
      noBorder
      items={MENU_OPTIONS}
      onChange={selectedItem => props.onChange(selectedItem)}
      menuStyle={{ width: '100%', overflow: 'hidden' }}
      itemToString={item => item.title}
      selectedItem={
        MENU_OPTIONS.find(item => item.value === props.selectedItem) ||
        MENU_OPTIONS[0]
      }
      buttonText={
        MENU_OPTIONS.find(item => item.value === props.selectedItem).title
      }
      buttonStyle={{
        padding: '0 0.5rem',
        fontSize: '0.9rem',
        fontWeight: 'bold'
      }}
      style={{
        marginRight: '0.5rem'
      }}
      itemRenderer={({ item, ...rest }) => (
        <Item key={item.value} title={item.title} {...rest} />
      )}
    />
  )
}
