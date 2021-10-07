import { ComponentProps } from 'react'

import { List, makeStyles } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import { parseFullName } from 'parse-full-name'
import AutoSizer from 'react-virtualized-auto-sizer'

import { isValidNameTitle } from '@app/views/components/DealRole/validators/is-valid-legal-prefix'
import AutoComplete from 'components/SearchWithCTA'
import VirtualList from 'components/VirtualList'
import searchAgents from 'models/agent/search'
import { searchContacts } from 'models/contacts/search-contacts'

import { IDealFormRole } from '../../types'

import { AgentRow } from './AgentRow'
import { ContactRow } from './ContactRow'

interface Props {
  source?: 'MLS' | 'CRM'
  placeholder: string
  onSelectRole: (role: Partial<IDealFormRole>) => void
}

const useStyles = makeStyles(
  theme => ({
    listbox: {
      padding: 0,
      margin: 0,
      listStyle: 'none',
      backgroundColor: theme.palette.background.paper
    }
  }),
  { name: 'ContactRolesAutoComplete' }
)
const autocompleteRowHeight = 60

export function ContactRoles({
  placeholder,
  source = 'CRM',
  onSelectRole
}: Props) {
  const classes = useStyles()
  const searchContactsModel = (value: string) =>
    new Promise(resolve => {
      resolve(resolve(searchContacts(value)))
    }).then((response: ApiResponseBody<IContact[]>) => response.data)

  const searchAgentsModel = (value: string) =>
    new Promise<IAgent[]>(resolve => resolve(searchAgents(value, 'q')))

  /**
   * Starts creating a new contact based on the given name
   */
  const createNewContact = (inputValue: string) => {
    const { first, last, middle, title } = parseFullName(
      inputValue,
      'all',
      1,
      0,
      0
    )

    handleSelectRole({
      legal_prefix: isValidNameTitle(title) ? title : undefined,
      legal_first_name: first,
      legal_last_name: last,
      legal_middle_name: middle
    })
  }

  const handleSelectRole = (role: Partial<IDealFormRole>) => {
    onSelectRole(role)
  }

  return (
    <>
      {source === 'MLS' && (
        <AutoComplete<IAgent>
          placeholder={placeholder}
          onFooterClick={createNewContact}
          model={searchAgentsModel}
          minChars={3}
          clearOnBlur
          getOptionLabel={(option: IAgent) => option.full_name}
          renderFooter={inputValue => (
            <>
              <AddIcon fontSize="small" />
              Create a new contact: '{inputValue}'
            </>
          )}
          renderOption={(
            options,
            getOptionProps,
            getHighlightedText,
            { inputValue }
          ) => {
            return (
              <List
                className={classes.listbox}
                style={{
                  height:
                    options.length < 5
                      ? `${options.length * autocompleteRowHeight}px`
                      : '270px'
                }}
              >
                <AutoSizer>
                  {({ width, height }) => {
                    return (
                      <VirtualList
                        key={inputValue}
                        width={width}
                        height={height}
                        itemCount={options.length}
                        itemData={
                          {
                            options,
                            getHighlightedText,
                            inputValue,
                            getOptionProps,
                            onSelectRole: handleSelectRole
                          } as ComponentProps<typeof AgentRow>['data']
                        }
                        threshold={2}
                        isLoading={false}
                        itemSize={index => autocompleteRowHeight}
                        overscanCount={3}
                      >
                        {AgentRow}
                      </VirtualList>
                    )
                  }}
                </AutoSizer>
              </List>
            )
          }}
        />
      )}

      {source === 'CRM' && (
        <AutoComplete<IContact>
          placeholder={placeholder}
          onFooterClick={createNewContact}
          model={searchContactsModel}
          clearOnBlur
          getOptionLabel={(option: IContact) => option.display_name}
          renderFooter={inputValue => (
            <>
              <AddIcon fontSize="small" />
              Create a new contact: '{inputValue}'
            </>
          )}
          renderOption={(
            options,
            getOptionProps,
            getHighlightedText,
            { inputValue }
          ) => {
            return (
              <List
                className={classes.listbox}
                style={{
                  height:
                    options.length < 5
                      ? `${options.length * autocompleteRowHeight}px`
                      : '270px'
                }}
              >
                <AutoSizer>
                  {({ width, height }) => {
                    return (
                      <VirtualList
                        key={inputValue}
                        width={width}
                        height={height}
                        itemCount={options.length}
                        itemData={
                          {
                            options,
                            getHighlightedText,
                            inputValue,
                            getOptionProps,
                            onSelectRole: handleSelectRole
                          } as ComponentProps<typeof ContactRow>['data']
                        }
                        threshold={2}
                        isLoading={false}
                        itemSize={index => autocompleteRowHeight}
                        overscanCount={3}
                      >
                        {ContactRow}
                      </VirtualList>
                    )
                  }}
                </AutoSizer>
              </List>
            )
          }}
        />
      )}
    </>
  )
}
