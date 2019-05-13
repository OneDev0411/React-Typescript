import React from 'react'

import usePromise from 'react-use-promise'

import { Item } from 'components/Dropdown/Item'

import Loading from 'partials/Loading'

import { List, Placeholder } from './styled'

export function SimpleList({
  options,
  getOptions,
  onFilterChange,
  onToggleFilterActive
}) {
  const [resolvedOptions = [], error, state] = usePromise(
    () => Promise.resolve(getOptions ? getOptions() : options || []),
    []
  )

  if (error) {
    return <Placeholder hasError>Could not fetch options</Placeholder>
  }

  if (state === 'pending') {
    return <Loading />
  }

  return resolvedOptions.length === 0 ? (
    <Placeholder>Nothing to select</Placeholder>
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
