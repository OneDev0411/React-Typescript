import React from 'react'

import { ListContainer, ListTitle } from '../styled'
import { Body } from '../components/Body'

export function DefaultItems(props) {
  const hasDefaultListsWithItems = props.defaultLists.some(
    list => list.items.length > 0
  )

  if (
    (!props.multipleSelection && props.searchResults.length > 0) ||
    props.isLoading ||
    !hasDefaultListsWithItems
  ) {
    return null
  }

  return (
    <>
      {props.defaultLists.map(list => (
        <ListContainer
          key={list.title}
          style={{
            marginTop: '1rem'
          }}
        >
          <ListTitle>{list.title}</ListTitle>

          <Body
            getItemProps={props.getItemProps}
            list={list.items}
            handleSelectItem={props.handleSelectItem}
            ItemRow={props.ItemRow}
            showAddButton={props.multipleSelection}
          />
        </ListContainer>
      ))}
    </>
  )
}
