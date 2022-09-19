import { useState, useMemo } from 'react'

import { Typography, List, ListItem } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import classnames from 'classnames'
import escapeRegExp from 'lodash/escapeRegExp'
import usePromise from 'react-use-promise'
import Flex from 'styled-flex-component'
import useDebouncedCallback from 'use-debounce/lib/callback'

import Search from '@app/views/components/Grid/Search'
import Loading from 'components/SvgIcons/CircleSpinner/IconCircleSpinner'

const useStyles = makeStyles(
  theme => ({
    root: {
      maxWidth: '100%',
      padding: theme.spacing(1),
      overflowX: 'hidden',
      maxHeight: '18.75rem',
      overflowY: 'auto'
    },
    zeroState: {
      textAlign: 'center',
      margin: theme.spacing(2, 0),
      color: theme.palette.grey['400']
    }
  }),
  { name: 'ContactFilterSimpleList' }
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
  const [query, setQuery] = useState('')
  const [debouncedSetQuery] = useDebouncedCallback(setQuery, 400)

  const items = useMemo(() => {
    if (!query) {
      return resolvedOptions
    }

    const regExp = new RegExp(escapeRegExp(query), 'gi')

    return resolvedOptions.filter(item => item.label.match(regExp))
  }, [resolvedOptions, query])

  if (error) {
    console.error(error)

    return (
      <Typography variant="body1" color="error" className={classes.zeroState}>
        Could not fetch items
      </Typography>
    )
  }

  if (state === 'pending') {
    return (
      <Flex center>
        <Loading />
      </Flex>
    )
  }

  const renderItems = () => {
    if (items.length === 0) {
      return (
        <Typography variant="body1" className={classes.zeroState}>
          Nothing to select!
        </Typography>
      )
    }

    return (
      <List>
        {items.map((item, index) => (
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
            <Typography noWrap>{item.label}</Typography>
          </ListItem>
        ))}
      </List>
    )
  }

  return (
    <div className={classnames('u-scrollbar--thinner--self', classes.root)}>
      <Search
        autoFocus
        placeholder="Search"
        onChange={value => debouncedSetQuery(value)}
      />
      {renderItems()}
    </div>
  )
}
