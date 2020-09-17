import React, { useMemo } from 'react'
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

// TODO: Upgrade the styling solution:
export default function ({ title, items, onChange, onChangeAll }: Props) {
  const allSelected = useMemo(
    () =>
      items.every(({ selected }) => selected) &&
      uniq(items.map(({ reminderSeconds }) => reminderSeconds)).length === 1,
    [items]
  )
  const allReminderSeconds = !allSelected ? 0 : items[0].reminderSeconds

  return (
    <Flex
      full
      column
      style={{
        paddingLeft: '2rem'
      }}
    >
      <h2 style={{ marginBottom: '3rem' }}>{title}</h2>
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
