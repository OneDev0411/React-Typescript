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
      onSelect={item => props.mutators && props.mutators.populateRole(item)}
      options={props.options}
      showHintOnFocus={props.showHintOnFocus}
      hintMessage={props.hintMessage}
      hintStyle={{
        top: '4.5rem'
      }}
      inputProps={{
        highlightOnError: true
      }}
      itemRenderer={({ index, itemProps, item }) => (
        <ListItem key={index} {...itemProps}>
          <ItemTitle>{item.label}</ItemTitle>
          <ItemDescription isActive={itemProps.isActive}>
            <div>{item.email}</div>
            {item.office && <div>{item.office.name}</div>}
            {item.mlsid && <div>MLS ID: {item.mlsid}</div>}
          </ItemDescription>
        </ListItem>
      )}
    />
  )
}
