import React, { useMemo } from 'react'
import { Theme, useTheme } from '@material-ui/core'
import Flex, { FlexItem } from 'styled-flex-component'
import { uniq } from 'lodash'

import { ItemState } from '../types'

import Item from './Item'

interface Props {
  title: string
  items: readonly ItemState[]
  onChange: (newItem: ItemState) => void
  onChangeAll: (newItems: readonly ItemState[]) => void
}

export default function ({ title, items, onChange, onChangeAll }: Props) {
  const theme = useTheme<Theme>()

  const allSelected = useMemo(
    () =>
      items.every(({ selected }) => selected) &&
      uniq(items.map(({ reminderSeconds }) => reminderSeconds)).length === 1,
    [items]
  )
  const allReminderSeconds = !allSelected ? 0 : items[0].reminderSeconds

  return (
    <Flex full column style={{ paddingLeft: theme.spacing(4) }}>
      <h2 style={{ marginBottom: theme.spacing(6) }}>{title}</h2>
      <FlexItem>
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
      </FlexItem>
      {items.map(item => (
        <FlexItem key={item.eventType}>
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
        </FlexItem>
      ))}
    </Flex>
  )
}
