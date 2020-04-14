import React from 'react'
import classnames from 'classnames'
import usePromise from 'react-use-promise'
import Flex from 'styled-flex-component'

import { List, ListItem } from '@material-ui/core'
import { createStyles, makeStyles } from '@material-ui/core/styles'

import Loading from 'components/SvgIcons/CircleSpinner/IconCircleSpinner'

import { Placeholder } from './Placeholder'

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      maxWidth: '100%',
      width: '18.75rem',
      maxHeight: '18.75rem',
      overflow: 'auto'
    }
  })
)

export function SimpleList({
  getOptions,
  onFilterChange,
  onToggleFilterActive
}) {
  const classes = useStyles()
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
    <div className={classnames('u-scrollbar--thinner--self', classes.root)}>
      <List>
        {resolvedOptions.map((item, index) => (
          <ListItem
            button
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
          </ListItem>
        ))}
      </List>
    </div>
  )
}
