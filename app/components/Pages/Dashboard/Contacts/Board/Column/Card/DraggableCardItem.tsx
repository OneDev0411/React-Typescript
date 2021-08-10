import React from 'react'

import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot
} from 'react-beautiful-dnd'
import { areEqual } from 'react-window'

import { CardItem } from './CardItem'

interface Props {
  style: React.CSSProperties
  index: number
  data: {
    rows: IContact[]
    columnId: string
  }
}

export const DraggableCardItem = React.memo(function DraggableCardItem({
  style,
  index,
  data: { rows, columnId }
}: Props) {
  const contact = rows[index]

  if (!contact) {
    return null
  }

  return (
    <Draggable
      draggableId={`${columnId}:${contact.id}`}
      index={index}
      key={contact.id}
    >
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <CardItem
          provided={provided}
          contact={contact}
          style={style}
          isDragging={snapshot.isDragging}
        />
      )}
    </Draggable>
  )
},
areEqual)
