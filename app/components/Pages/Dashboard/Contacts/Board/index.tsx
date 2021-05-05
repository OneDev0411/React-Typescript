import { useEffect, useState } from 'react'

import { makeStyles, Theme } from '@material-ui/core'
import uniq from 'lodash/uniq'

import { DragDropContext, DropResult } from 'react-beautiful-dnd'

import { bulkTag } from 'models/contacts/bulk-tag'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      display: 'flex',
      overflowX: 'scroll',
      overflowY: 'hidden',
      height: '64vh'
    },
    container: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'nowrap',
      marginBottom: theme.spacing(1)
    }
  }),
  {
    name: 'Board'
  }
)

import { BoardColumn } from './Column'

const Columns = ['Warm List', 'Hot List', 'Passed List']

interface Props {
  contacts: IContact[]
}

export function Board({ contacts }: Props) {
  const classes = useStyles()
  const [list, setList] = useState(contacts)

  useEffect(() => {
    setList(contacts)
  }, [contacts])

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return
    }

    const [, contactId] = result.draggableId.split(':')
    const oldTag = Columns[result.source.droppableId]
    const newTag = Columns[result.destination.droppableId]

    const contact = list.find(contact => contact.id === contactId)!
    const tags = uniq(
      (contact.tags || []).filter(tag => tag !== oldTag).concat(newTag)
    )

    setList(
      list.map(row =>
        row.id !== contactId
          ? row
          : {
              ...row,
              tags,
              updated_at: Date.now() / 1000
            }
      )
    )

    bulkTag(tags, {
      ids: [contactId]
    })
  }

  const sort = (contacts: IContact[]) => {
    return contacts.sort((a, b) => b.updated_at - a.updated_at)
  }

  return (
    <div className={classes.root}>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className={classes.container}>
          <BoardColumn
            id={(-1).toString()}
            title="All Contacts"
            list={sort(
              list.filter(
                contact =>
                  (contact.tags || []).length === 0 ||
                  contact.tags?.every(tag => !Columns.includes(tag))
              )
            )}
            droppable={false}
          />

          {Columns.map((name, index) => (
            <BoardColumn
              key={index}
              id={index.toString()}
              title={name}
              list={sort(list.filter(contact => contact.tags?.includes(name)))}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  )
}
