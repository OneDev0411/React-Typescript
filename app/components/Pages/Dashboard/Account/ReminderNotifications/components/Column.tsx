import React, { useMemo } from 'react'
import { Theme, makeStyles, Grid } from '@material-ui/core'
import { uniq } from 'lodash'

import { ItemState } from '../types'

import Item from './Item'

const useStyles = makeStyles(
  (theme: Theme) => ({
    title: {
      marginBottom: theme.spacing(6)
    }
  }),
  { name: 'ReminderNotifications-Column' }
)

interface Props {
  title: string
  items: readonly ItemState[]
  onChange: (newItem: ItemState) => void
  onChangeAll: (newItems: readonly ItemState[]) => void
}

export default function Column({ title, items, onChange, onChangeAll }: Props) {
  const classes = useStyles()

  const allSelected = useMemo(
    () =>
      items.every(({ selected }) => selected) &&
      uniq(items.map(({ reminderSeconds }) => reminderSeconds)).length === 1,
    [items]
  )
  const allReminderSeconds = allSelected ? items[0].reminderSeconds : 0

  return (
    <Grid container direction="column">
      <Grid item>
        <h2 className={classes.title}>{title}</h2>
      </Grid>

      <Grid item>
        <Item
          label="All"
          selected={allSelected}
          reminderSeconds={allReminderSeconds}
          onChange={(selected, reminderSeconds) =>
            onChangeAll(
              items.map(item => ({
                ...item,
                selected,
                reminderSeconds
              }))
            )
          }
        />
      </Grid>

      {items.map(item => (
        <Grid item key={item.eventType}>
          <Item
            label={item.label}
            selected={item.selected}
            reminderSeconds={item.reminderSeconds}
            onChange={(selected, reminderSeconds) =>
              onChange({
                ...item,
                selected,
                reminderSeconds
              })
            }
          />
        </Grid>
      ))}
    </Grid>
  )
}
