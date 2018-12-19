import React from 'react'

import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

export class Body extends React.Component {
  onDragEnd = result => {
    if (!result.destination) {
      return false
    }

    const newList = this.reorder(
      this.props.list,
      result.source.index,
      result.destination.index
    )

    this.props.onUpdateList(newList, 'sort')
  }

  handleRemove = item => {
    const newList = this.props.list.filter(row => row.id !== item.id)

    this.props.onUpdateList(newList, 'remove')
  }

  reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)

    result.splice(endIndex, 0, removed)

    return result
  }

  getListStyle = () => ({
    background: '#fff',
    width: '100%'
  })

  getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    background: isDragging ? '#fff' : 'transparent',
    boxShadow: isDragging ? '0 0 10px 0 rgba(0, 0, 0, 0.2);' : 'none',
    ...draggableStyle
  })

  render() {
    const { ItemRow } = this.props
    const isDraggable = this.props.isUpdatingList && this.props.list.length > 1

    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="listings-droppable">
          {(droppableProvided, droppableSnapshot) => (
            <div
              ref={droppableProvided.innerRef}
              style={this.getListStyle(droppableSnapshot.isDraggingOver)}
            >
              {this.props.list.map((item, index) => (
                <Draggable
                  key={item.id}
                  isDragDisabled={!isDraggable}
                  draggableId={item.id}
                  index={index}
                >
                  {(draggableProvided, draggableSnapshot) => (
                    <div
                      ref={draggableProvided.innerRef}
                      {...draggableProvided.draggableProps}
                      {...draggableProvided.dragHandleProps}
                      style={this.getItemStyle(
                        draggableSnapshot.isDragging,
                        draggableProvided.draggableProps.style
                      )}
                    >
                      <ItemRow
                        key={item.id}
                        item={item}
                        isHighlighted={this.props.highlightedIndex === index}
                        isUpdatingList={this.props.isUpdatingList}
                        isDraggable={isDraggable}
                        totalItems={this.props.list.length}
                        onClickRemove={() => this.handleRemove(item)}
                        {...this.props.getItemProps({
                          item,
                          onClick: () => this.props.handleSelectItem(item)
                        })}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    )
  }
}
