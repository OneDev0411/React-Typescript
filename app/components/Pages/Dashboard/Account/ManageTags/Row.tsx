import React from 'react'
import { Theme, makeStyles } from '@material-ui/core'

import Item from './Item'

const useStyles = makeStyles(
  (theme: Theme) => ({
    rowContainer: {
      display: 'flex',
      alignItems: 'flex-start',
      background: ({ highlight }: { highlight: boolean }) =>
        highlight ? theme.palette.grey[50] : 'inherit',
      borderBottom: `1px solid ${theme.palette.divider}`,
      transition: 'background-color 1s ease-in'
    },
    rowTitle: {
      color: theme.palette.tertiary.dark,
      marginTop: theme.spacing(2),
      marginRight: theme.spacing(3),
      ...theme.typography.subtitle1
    },
    itemContainer: {
      flexGrow: 1
    }
  }),
  { name: 'ManageTagsRow' }
)

export interface Props {
  title: string
  items: IContactTag[]
  onChange: (payload: {
    oldText: string
    newText: string
    touchDate: Nullable<number>
  }) => void
  onDelete: (tag: IContactTag) => void
}

export default function ManageTagsRow({
  title,
  items,
  onChange,
  onDelete
}: Props) {
  const highlight = items.some(item => item.highlight)
  const classes = useStyles({ highlight })

  // console.log({ title, items, onChange, onDelete })

  return (
    <div className={classes.rowContainer}>
      <div className={classes.rowTitle}>{title}</div>
      <div className={classes.itemContainer}>
        {items.map(tag => (
          <Item
            onChange={onChange}
            onDelete={onDelete}
            key={tag.id}
            tag={tag}
          />
        ))}
      </div>
    </div>
  )
}
