import { useState } from 'react'

import { makeStyles, Theme } from '@material-ui/core'
import uniq from 'lodash/uniq'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import { useDispatch } from 'react-redux'
import useDeepCompareEffect from 'use-deep-compare-effect'

import { updateContactTags } from 'actions/contacts/update-contact-tags'
import { bulkTag } from 'models/contacts/bulk-tag'

import { BoardColumn } from './Column'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      display: 'flex',
      overflowY: 'hidden',
      overflowX: 'scroll',
      height: '100%'
    },
    container: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'nowrap',
      height: '100%',
      paddingBottom: theme.spacing(1)
    }
  }),
  {
    name: 'Board-Container'
  }
)

const Columns = ['Warm', 'Hot', 'Past Client']

interface Props {
  contacts: IContact[]
  isFetchingContacts: boolean
  isFetchingNextContacts: boolean
  isFetchingPreviousContacts: boolean
  onColumnReachStart: () => void
  onColumnReachEnd: () => void
}

export function Board({
  contacts,
  isFetchingContacts,
  isFetchingNextContacts,
  isFetchingPreviousContacts,
  onColumnReachStart,
  onColumnReachEnd
}: Props) {
  const classes = useStyles()
  const [list, setList] = useState(contacts)
  const dispatch = useDispatch()

  useDeepCompareEffect(() => {
    setList(contacts)
  }, [contacts])

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return
    }

    const [, contactId] = result.draggableId.split(':')
    const oldTag = Columns[result.source.droppableId]
    const newTag = Columns[result.destination?.droppableId ?? -1]

    const contact = list.find(contact => contact.id === contactId)!
    const tags = uniq(
      (contact.tags || []).filter(tag => tag !== oldTag).concat(newTag || [])
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

    dispatch(updateContactTags(contact.id, tags))
  }

  const sort = (contacts: IContact[]) => {
    return contacts.sort((a, b) => b.updated_at - a.updated_at)
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={classes.root}>
        <div className={classes.container}>
          <BoardColumn
            isFetchingContacts={isFetchingContacts && list.length === 0}
            isFetchingNextContacts={isFetchingNextContacts}
            isFetchingPreviousContacts={isFetchingPreviousContacts}
            id={(-1).toString()}
            title="All Contacts"
            list={sort(
              list.filter(
                contact =>
                  (contact.tags || []).length === 0 ||
                  contact.tags?.every(tag => !Columns.includes(tag))
              )
            )}
            onReachStart={onColumnReachStart}
            onReachEnd={onColumnReachEnd}
          />

          {Columns.map((name, index) => (
            <BoardColumn
              key={index}
              id={index.toString()}
              title={name}
              isFetchingContacts={isFetchingContacts && list.length === 0}
              list={sort(list.filter(contact => contact.tags?.includes(name)))}
            />
          ))}
        </div>
      </div>
    </DragDropContext>
  )
}
