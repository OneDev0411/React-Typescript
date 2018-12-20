import React from 'react'
import _ from 'underscore'

import { ListContainer, ListTitle } from '../styled'
import { Body } from '../components/Body'

export function SelectedItems(props) {
  if (
    !props.multipleSelection ||
    props.isLoading ||
    _.size(props.selectedItems) === 0
  ) {
    return false
  }

  return (
    <ListContainer
      style={{
        borderBottom: props.hasDefaultList ? '1px solid #f2f2f2' : 'none'
      }}
    >
      <ListTitle>{_.size(props.selectedItems)} Selected</ListTitle>

      <Body
        removable
        isDraggable={_.size(props.selectedItems) > 1}
        getItemProps={props.getItemProps}
        list={Object.values(props.selectedItems)}
        onUpdateList={props.onUpdateList}
        ItemRow={props.ItemRow}
      />
    </ListContainer>
  )
}
