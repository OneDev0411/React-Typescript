import { useState } from 'react'

import { makeStyles, TextField, Theme } from '@material-ui/core'
import { useDebounce } from 'react-use'
import AutoSizer from 'react-virtualized-auto-sizer'

import VirtualList, { LoadingPosition } from '../VirtualList'

import { ContactRow } from './ContactRow'
import { useContactsList } from './queries/use-contacts-list'
import { useFilterContacts } from './queries/use-filter-contacts'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      width: '400px'
    },
    list: {
      minHeight: '400px'
    },
    searchContainer: {
      padding: theme.spacing(1, 2)
    }
  }),
  {
    name: 'ContactsList'
  }
)

export function ContactsList() {
  const classes = useStyles()
  const [searchCriteria, setSearchCriteria] = useState('')
  const [debouncedSearchCriteria, setDebouncedSearchCriteria] =
    useState(searchCriteria)

  useDebounce(
    () => {
      setDebouncedSearchCriteria(searchCriteria)
    },
    200,
    [searchCriteria]
  )

  const { fetchNextPage, isLoading, isFetchingNextPage, contacts } =
    useContactsList()

  const { data: filteredContacts, isLoading: isSearching } = useFilterContacts(
    debouncedSearchCriteria
  )

  const list = searchCriteria.length > 0 ? filteredContacts : contacts

  return (
    <div className={classes.root}>
      <div className={classes.searchContainer}>
        <TextField
          placeholder="Search contact"
          value={searchCriteria}
          InputProps={{
            disableUnderline: true
          }}
          onChange={e => setSearchCriteria(e.target.value)}
        />
      </div>
      <div className={classes.list}>
        <AutoSizer>
          {({ width, height }) => (
            <VirtualList
              width={width}
              height={height}
              itemCount={list?.length ?? 0}
              itemData={
                {
                  rows: contacts
                } as React.ComponentProps<typeof ContactRow>['data']
              }
              threshold={2}
              itemSize={() => 60}
              overscanCount={3}
              onReachEnd={() => fetchNextPage()}
              isLoading={isLoading || isFetchingNextPage || isSearching}
              loadingPosition={
                isFetchingNextPage
                  ? LoadingPosition.Bottom
                  : LoadingPosition.Middle
              }
            >
              {ContactRow}
            </VirtualList>
          )}
        </AutoSizer>
      </div>
    </div>
  )
}
