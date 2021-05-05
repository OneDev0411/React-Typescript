import { makeStyles, Theme } from '@material-ui/core'
import { DragDropContext } from 'react-beautiful-dnd'

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

  const onDragEnd = () => {}

  return (
    <div className={classes.root}>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className={classes.container}>
          <BoardColumn
            id={0}
            title="All Contacts"
            list={contacts}
            droppable={false}
          />

          {Columns.map((name, index) => (
            <BoardColumn
              key={index}
              id={index + 1}
              title={name}
              list={contacts.filter(contact => contact.tags?.includes(name))}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  )
}
