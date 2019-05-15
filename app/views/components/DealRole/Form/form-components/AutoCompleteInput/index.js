import React from 'react'

import { AutoComplete } from 'components/AutoComplete'

import { ListItem } from 'components/AutoComplete/styled'

import { ItemTitle, ItemDescription } from './styled'

export function AutoCompleteInput(props) {
  if (!props.isVisible) {
    return false
  }

  return (
    <AutoComplete
      {...props}
      listStyle={{
        top: '75%'
      }}
      onSelect={item => props.mutators && props.mutators.setAgent(item)}
      options={props.options}
      inputProps={{
        highlightOnError: true
      }}
      itemRenderer={({ index, itemProps, item }) => (
        <ListItem key={index} {...itemProps}>
          <ItemTitle>{item.label}</ItemTitle>
          <ItemDescription isActive={itemProps.isActive}>
            <div>{item.email || 'No email'}</div>
            {item.mlsid && <div>MLS ID: {item.mlsid}</div>}
          </ItemDescription>
        </ListItem>
      )}
    />
  )
}
