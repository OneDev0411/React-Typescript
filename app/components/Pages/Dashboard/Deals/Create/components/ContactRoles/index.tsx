import React, { useState } from 'react'

import {
  Box,
  makeStyles,
  TextField,
  Theme,
  Paper,
  CircularProgress
} from '@material-ui/core'
import { parseFullName } from 'parse-full-name'
import { useAsync, useDebounce } from 'react-use'
import AutoSizer from 'react-virtualized-auto-sizer'

import { isMlsNumber } from '@app/utils/is-mls-number'
import { isValidNameTitle } from '@app/views/components/DealRole/validators/is-valid-legal-prefix'
import VirtualList from 'components/VirtualList'
import searchAgents from 'models/agent/search'
import { searchContacts } from 'models/contacts/search-contacts'

import { IDealFormRole } from '../../types'

import { Row, RowItem, RowType } from './Row'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      '&.has-border': {
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius
      }
    },
    listContainer: {
      padding: theme.spacing(1)
    },
    searchInput: {
      padding: theme.spacing(1, 0)
    }
  }),
  {
    name: 'CreateDeal-PrimaryAgent'
  }
)

interface Props {
  source?: 'MLS' | 'CRM'
  placeholder: string
  onSelectRole: (role: Partial<IDealFormRole>) => void
}

export function ContactRoles({
  placeholder,
  source = 'CRM',
  onSelectRole
}: Props) {
  const classes = useStyles()

  const [searchCriteria, setSearchCriteria] = useState<string>('')
  const [debouncedSearchCriteria, setDebouncedSearchCriteria] =
    useState<string>('')

  const [isSearching, setIsSearching] = useState(false)
  const [rows, setRows] = useState<RowItem[]>([])

  /**
   * debounce search criteria to don't search contacts on input change
   */
  useDebounce(
    () => {
      setDebouncedSearchCriteria(searchCriteria)
    },
    700,
    [searchCriteria]
  )

  /**
   * Search for contacts when the search criteria changes
   */
  useAsync(async () => {
    if (searchCriteria.length === 0) {
      setRows([])

      return
    }

    if (searchCriteria.length < 3) {
      return
    }

    setIsSearching(true)

    if (source === 'MLS') {
      const agents: IAgent[] = await searchAgents(searchCriteria, 'q')

      setRows([
        {
          type: RowType.New,
          name: searchCriteria
        },
        ...agents.map(
          agent =>
            ({
              type: RowType.Agent,
              agent
            } as RowItem)
        )
      ])
    }

    if (source === 'CRM') {
      const { data: contacts } = await searchContacts(searchCriteria)

      setRows([
        {
          type: RowType.New,
          name: searchCriteria
        },
        ...contacts.map(
          contact =>
            ({
              type: RowType.Contact,
              contact
            } as RowItem)
        )
      ])
    }

    setIsSearching(false)
  }, [debouncedSearchCriteria])

  /**
   * Starts creating a new contact based on the given name
   */
  const createNewContact = () => {
    let { first, last, middle, title } = parseFullName(
      debouncedSearchCriteria,
      'all',
      1,
      0,
      0
    )

    if (isMlsNumber(debouncedSearchCriteria)) {
      first = ''
      last = ''
      middle = ''
    }

    handleSelectRole({
      legal_prefix: isValidNameTitle(title) ? title : undefined,
      legal_first_name: first,
      legal_last_name: last,
      legal_middle_name: middle
    })
  }

  const handleSelectRole = (role: Partial<IDealFormRole>) => {
    setSearchCriteria('')
    setRows([])

    onSelectRole(role)
  }

  return (
    <Box className={classes.root}>
      <TextField
        fullWidth
        autoComplete="no-autocomplete"
        variant="outlined"
        size="small"
        value={searchCriteria}
        onChange={e => setSearchCriteria(e.target.value)}
        placeholder={placeholder}
        className={classes.searchInput}
      />

      {isSearching && <CircularProgress />}

      {rows.length > 0 && !isSearching && (
        <Paper
          className={classes.listContainer}
          style={{
            height: rows.length < 5 ? `${rows.length * 60 + 16}px` : '250px'
          }}
        >
          <AutoSizer>
            {({ width, height }) => (
              <VirtualList
                width={width}
                height={height}
                itemCount={rows.length}
                itemData={
                  {
                    rows,
                    searchCriteria,
                    onSelectRole: handleSelectRole,
                    onCreateNewContact: createNewContact
                  } as React.ComponentProps<typeof Row>['data']
                }
                threshold={2}
                itemSize={() => 60}
                overscanCount={3}
              >
                {Row}
              </VirtualList>
            )}
          </AutoSizer>
        </Paper>
      )}
    </Box>
  )
}
