import React from 'react'
import { makeStyles } from '@material-ui/core'

import Item from './Item'

const useStyles = makeStyles(
  theme => ({
    rowContainer: {
      display: 'flex',
      flexRirection: 'row',
      background: ({ highlight }) =>
        highlight ? theme.palette.grey[50] : 'inherit',
      padding: theme.spacing(1, 0),
      borderBottom: `1px solid ${theme.palette.divider}`,
      transition: 'background-color 1s ease-in'
    },
    rowTitle: {
      color: theme.palette.tertiary.dark,
      margin: theme.spacing('auto', 3),
      ...theme.typography.subtitle1
    },
    itemContainer: {
      background: 'red',
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',

      '& > div': {
        padding: 0,
        display: 'flex',
        alignItems: 'center'
      }
    }
  }),
  { name: 'ManageTagsRow' }
)

export default function ManageTagsRow({ title, items, onChange, onDelete }) {
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
            key={tag.text}
            tag={tag}
          />
        ))}
      </div>
    </div>
  )
}
