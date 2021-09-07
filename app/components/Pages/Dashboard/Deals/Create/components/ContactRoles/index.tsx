import { ListItem } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import { parseFullName } from 'parse-full-name'

import { isValidNameTitle } from '@app/views/components/DealRole/validators/is-valid-legal-prefix'
import AutoComplete from 'components/SearchWithCTA'
import searchAgents from 'models/agent/search'
import { searchContacts } from 'models/contacts/search-contacts'

import { convertContactToRole, convertAgentToRole } from '../../../utils/roles'
import { IDealFormRole } from '../../types'

import { AgentRow } from './AgentRow'
import { ContactRow } from './ContactRow'

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
          debug
          model={searchAgentsModel}
          minChars={3}
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
              <>
                {options.map((option, index) => (
                  <ListItem
                    key={index}
                    {...getOptionProps({ option, index })}
                    onClick={() => onSelectRole(convertAgentToRole(option))}
                  >
                    <AgentRow
                      agent={option}
                      primaryText={getHighlightedText(
                        option.full_name,
                        inputValue
                      )}
                    />
                  </ListItem>
                ))}
              </>
            )
          }}
        />
      )}

      {source === 'CRM' && (
        <AutoComplete<IContact>
          placeholder={placeholder}
          onFooterClick={createNewContact}
          debug={false}
          model={searchContactsModel}
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
              <>
                {options.map((option, index) => (
                  <ListItem
                    key={index}
                    {...getOptionProps({ option, index })}
                    onClick={() => onSelectRole(convertContactToRole(option))}
                  >
                    <ContactRow
                      contact={option}
                      primaryText={getHighlightedText(
                        option.display_name,
                        inputValue
                      )}
                    />
                  </ListItem>
                ))}
              </>
            )
          }}
        />
      )}
    </>
  )
}
