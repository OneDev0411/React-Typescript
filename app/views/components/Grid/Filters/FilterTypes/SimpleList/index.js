import React from 'react'
import usePromise from 'react-use-promise'
import Flex from 'styled-flex-component'

import { Item } from 'components/Dropdown/Item'

import Loading from 'components/SvgIcons/CircleSpinner/IconCircleSpinner'

import { List, Placeholder } from './styled'

export function SimpleList({
  getOptions,
  onFilterChange,
  onToggleFilterActive
}) {
  const [resolvedOptions = [], error, state] = usePromise(
    () => Promise.resolve(getOptions()),
    []
  )

  if (error) {
    console.error(error)

    return <Placeholder hasError>Could not fetch items</Placeholder>
  }

  if (state === 'pending') {
    return (
      <Flex center>
        <Loading />
      </Flex>
    )
  }

  if (resolvedOptions.length === 0) {
    return <Placeholder>Nothing to select</Placeholder>
  }

  return (
    <List className="u-scrollbar--thinner--self">
      {resolvedOptions.map((item, index) => (
        <Item
          data-test="filter-item"
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
