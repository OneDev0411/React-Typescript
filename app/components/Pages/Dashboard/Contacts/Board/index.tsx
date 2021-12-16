import { useState, memo, useCallback } from 'react'

import { makeStyles, Theme } from '@material-ui/core'
import uniq from 'lodash/uniq'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import { useDispatch } from 'react-redux'
import { useDebounce } from 'react-use'

import { updateContactTags } from 'actions/contacts/update-contact-tags'
import { bulkTag } from 'models/contacts/bulk-tag'

import { BoardColumn } from './Column'
import { Columns } from './constants'
import { BoardContext } from './context'
import { FilterCriteria } from './types'

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

interface Props {
  criteria: FilterCriteria
}

export const Board = memo(({ criteria }: Props) => {
  const classes = useStyles()
  const [list, setList] = useState<Record<string, IContact[]>>({})
  const [debouncedCriteria, setDebouncedCriteria] =
    useState<Props['criteria']>(criteria)

  /**
   * why debouncing?
   *
   * this file:
   * "app/components/Pages/Dashboard/Contacts/List/TagsList/index.tsx#L76"
   * resets all filters first and then create new filters and changing that
   * was introducing new problems so I had to use deboucing when tags change
   */
  useDebounce(
    () => {
      setDebouncedCriteria(criteria)
    },
    500,
    [criteria]
  )

  const dispatch = useDispatch()

  const onDragEnd = (result: DropResult) => {
    if (
      !result.destination ||
      result.source.droppableId === result.destination.droppableId
    ) {
      return
    }

    const [, contactId] = result.draggableId.split(':')
    const oldTag = Columns.find(
      ({ tag }) => tag === result.source.droppableId
    )?.tag
    const newTag = Columns.find(
      ({ tag }) => tag === result.destination?.droppableId
    )?.tag

    const fromList = oldTag || 'all'
    const toList = newTag || 'all'

    const contact = list[fromList].find(contact => contact.id === contactId)!

    const tags = uniq(
      (contact.tags || []).filter(tag => tag !== oldTag).concat(newTag || [])
    )

    setList(list => ({
      ...list,
      [fromList]: list[fromList].filter(({ id }) => id !== contactId),
      [toList]: [{ ...contact, tags }, ...list[toList]]
    }))

    bulkTag(tags, {
      ids: [contactId]
    })

    dispatch(updateContactTags(contact.id, tags))
  }

  const handleUpdateList = useCallback(
    (contacts: IContact[], listName = 'all') => {
      setList(list => ({
        ...list,
        [listName]: contacts
      }))
    },
    []
  )

  return (
    <BoardContext.Provider
      value={{
        list,
        updateList: handleUpdateList
      }}
    >
      <DragDropContext onDragEnd={onDragEnd}>
        <div className={classes.root}>
          <div className={classes.container}>
            {Columns.map(({ title, tag }, index) => (
              <BoardColumn
                key={index}
                id={tag || '-1'}
                title={title}
                tag={tag}
                criteria={debouncedCriteria}
              />
            ))}
          </div>
        </div>
      </DragDropContext>
    </BoardContext.Provider>
  )
})
