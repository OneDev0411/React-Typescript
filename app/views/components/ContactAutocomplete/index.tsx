import { useCallback, useMemo, useState } from 'react'

import {
  Box,
  Chip,
  MenuItem,
  TextField,
  TextFieldProps,
  Typography
} from '@material-ui/core'
import {
  Autocomplete,
  AutocompleteGetTagProps,
  FilterOptionsState,
  createFilterOptions,
  AutocompleteProps
} from '@material-ui/lab'
import { useDebounce } from 'react-use'
import isEmail from 'validator/lib/isEmail'

import { Avatar } from '../Avatar'
import { BaseDropdown } from '../BaseDropdown'

import { useSearchContacts } from './queries/use-search-contacts'

interface Props<T extends boolean | undefined> {
  multiple?: boolean
  AutocompleteProps?: AutocompleteProps<IContact, T, true, true>
  TextFieldProps?: TextFieldProps
  onChange: (data: { contacts: IContact[]; emails: string[] }) => void
}

const filter = createFilterOptions<Partial<IContact>>()

export function UserAutocomplete<Multi extends boolean | undefined = false>({
  multiple = false,
  TextFieldProps = {},
  AutocompleteProps,
  onChange
}: Props<Multi>) {
  const [criteria, setCriteria] = useState('')
  const [selectedItems, setSelectedItems] = useState<Partial<IContact>[]>([])
  const [debouncedCriteria, setDebouncedCriteria] = useState(criteria)
  const [emailIndexMap, setEmailIndexMap] = useState<Record<string, number>>({})

  useDebounce(
    () => {
      setDebouncedCriteria(criteria)
    },
    300,
    [criteria]
  )

  const { data, isFetching } = useSearchContacts(debouncedCriteria)

  const options = useMemo(
    () =>
      !multiple && selectedItems.length > 0
        ? []
        : data.filter(
            contact =>
              Array.isArray(contact.emails) && contact.emails.length > 0
          ),
    [data, multiple, selectedItems]
  )

  const getOptionLabel = useCallback(
    (option: Partial<IContact>) => {
      if (!option.id) {
        return option.email as string
      }

      if (!Array.isArray(option.emails)) {
        return ''
      }

      const index = emailIndexMap[option.id] ?? 0

      return `${option.first_name} (${option.emails[index]})`
    },
    [emailIndexMap]
  )

  const getSelectedOptions = useCallback(
    (
      values: typeof selectedItems = selectedItems,
      mapIndex: typeof emailIndexMap = emailIndexMap
    ) => {
      return {
        contacts: values.filter(item => !!item.id) as IContact[],
        emails: values.map(item =>
          !item.id
            ? (item.email as string)
            : item.emails![mapIndex[item.id] ?? 0]
        )
      }
    },
    [emailIndexMap, selectedItems]
  )

  const handleChange = useCallback(
    (_, values: Partial<IContact>[]) => {
      setSelectedItems(values)
      onChange(getSelectedOptions(values))
    },
    [onChange, getSelectedOptions]
  )

  return (
    <Autocomplete
      multiple
      filterSelectedOptions
      freeSolo={!isFetching}
      noOptionsText={isFetching ? 'Searching...' : ''}
      disableClearable
      onChange={handleChange}
      getOptionLabel={getOptionLabel}
      renderOption={contact => {
        return (
          <Box display="flex" alignItems="center">
            <Box mr={1}>
              <Avatar contact={contact as IContact} />
            </Box>
            <Box>
              <Typography variant="body1">{contact.display_name}</Typography>
              <Typography variant="caption">{contact.email}</Typography>
            </Box>
          </Box>
        )
      }}
      renderTags={(list: IContact[], getTagProps: AutocompleteGetTagProps) => {
        return list.map((contact, index) => (
          <>
            {(contact.emails?.length ?? 0) > 1 ? (
              <BaseDropdown
                key={index}
                renderDropdownButton={props => (
                  <Chip
                    size="small"
                    label={getOptionLabel(contact)}
                    {...getTagProps({ index })}
                    {...props}
                  />
                )}
                renderMenu={({ close }) => (
                  <div>
                    {contact.emails?.map((email, index) => (
                      <MenuItem
                        key={index}
                        selected={(emailIndexMap[contact.id] ?? 0) === index}
                        onClick={() => {
                          close()

                          const nextEmailIndexMap = {
                            ...emailIndexMap,
                            [contact.id]: index
                          }

                          setEmailIndexMap(nextEmailIndexMap)

                          onChange(
                            getSelectedOptions(selectedItems, nextEmailIndexMap)
                          )
                        }}
                      >
                        {email}
                      </MenuItem>
                    ))}
                  </div>
                )}
              />
            ) : (
              <Chip
                size="small"
                label={contact.email}
                {...getTagProps({ index })}
              />
            )}
          </>
        ))
      }}
      renderInput={params => {
        const disabled = !multiple && selectedItems.length > 0

        return (
          <TextField
            {...params}
            variant="outlined"
            label="Email"
            {...TextFieldProps}
            InputProps={{
              ...params.InputProps,
              readOnly: disabled,
              placeholder: disabled ? '' : 'Search user'
            }}
            onChange={e => setCriteria(e.target.value)}
          />
        )
      }}
      filterOptions={(
        options: IContact[],
        params: FilterOptionsState<IContact>
      ) => {
        const filtered = filter(options, params)

        if (params.inputValue !== '' && isEmail(params.inputValue)) {
          filtered.push({
            email: params.inputValue,
            display_name: `Add "${params.inputValue}"`
          })
        }

        return filtered
      }}
      {...AutocompleteProps}
      options={options}
    />
  )
}
