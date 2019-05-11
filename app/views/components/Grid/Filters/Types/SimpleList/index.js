import React from 'react'

import usePromise from 'react-use-promise'

import { Item } from 'components/Dropdown/Item'

import Loading from 'partials/Loading'

import { List } from './styled'

export function SimpleList({
  options,
  getOptions,
  onFilterChange,
  onToggleFilterActive,
  values
}) {
  const [resolvedOptions = [], error, state] = usePromise(
    () => Promise.resolve(getOptions ? getOptions() : options || []),
    []
  )

  if (error) {
    return 'Could not fetch options'
  }

  return state === 'pending' ? (
    <Loading />
  ) : (
    <List className="u-scrollbar--thinner--self">
      {resolvedOptions.map((item, index) => (
        <Item
          onClick={() => {
            onFilterChange([item], {
              name: 'is'
            })
            onToggleFilterActive()
          }}
          key={index}
        >
          {item.label}
        </Item>
      ))}
    </List>
  )
}
