import { useCallback, useState } from 'react'

import { Box, makeStyles, TextField, Theme } from '@material-ui/core'
import cn from 'classnames'
import { useDebounce } from 'react-use'
import AutoSizer from 'react-virtualized-auto-sizer'

import VirtualList, { LoadingPosition } from '../VirtualList'

import { ContactRow } from './ContactRow'
import { useContactsList } from './queries/use-contacts-list'
import { useFilterContacts } from './queries/use-filter-contacts'
import { SelectedContacts } from './SelectedContacts'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      width: '400px'
    },
    list: {
      height: '400px'
    },
    searchContainer: {
      maxHeight: '200px',
      overflow: 'auto',
      padding: theme.spacing(1, 2),
      backgroundColor: theme.palette.action.hover
    },
    searchInput: {
      marginBottom: theme.spacing(0.5),
      padding: theme.spacing(0.75, 1),
      '&:focus': {
        backgroundColor: theme.palette.common.white
      }
    }
  }),
  {
    name: 'ContactsList'
  }
)

interface Props {
  defaultSelectedContacts?: IContact[]
  onChange: (contact: IContact[]) => void
}

export function ContactsList({
  defaultSelectedContacts = [],
  onChange
}: Props) {
  const classes = useStyles()
  const [selectedContacts, setSelectedContacts] = useState<IContact[]>([])
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

  const handleSelectContact = (contact: IContact) => {
    const nextList = selectedContacts.some(({ id }) => contact.id === id)
      ? selectedContacts.filter(({ id }) => id !== contact.id)
      : [...selectedContacts, contact]

    setSelectedContacts(nextList)
    setSearchCriteria('')

    onChange(nextList)
  }

  const handleRemove = useCallback(
    (id: UUID) => {
      const nextList = selectedContacts.filter(contact => id !== contact.id)

      setSelectedContacts(nextList)
      onChange(nextList)
    },
    [selectedContacts, onChange]
  )

  return (
    <div className={cn(classes.root, 'u-scrollbar--thinner')}>
      <div className={classes.searchContainer}>
        <SelectedContacts contacts={selectedContacts} onRemove={handleRemove} />
        <TextField
          autoFocus
          fullWidth={selectedContacts.length === 0}
          placeholder="Search contact"
          value={searchCriteria}
          InputProps={{
            disableUnderline: true,
            classes: {
              input: classes.searchInput
            }
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
                  selectedContacts: selectedContacts.concat(
                    defaultSelectedContacts
                  ),
                  rows: list,
                  onSelectContact: handleSelectContact
                } as React.ComponentProps<typeof ContactRow>['data']
              }
              threshold={2}
              itemSize={() => 60}
              overscanCount={3}
              onReachEnd={() => !searchCriteria && fetchNextPage()}
              isLoading={isLoading || isFetchingNextPage || isSearching}
              loadingPosition={
                isFetchingNextPage
                  ? LoadingPosition.Bottom
                  : LoadingPosition.Middle
              }
              itemKey={index => list[index].id}
            >
              {ContactRow}
            </VirtualList>
          )}
        </AutoSizer>

        {list?.length === 0 && !(isLoading || isSearching) && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="100%"
          >
            Nothing Found
          </Box>
        )}
      </div>
    </div>
  )
}
