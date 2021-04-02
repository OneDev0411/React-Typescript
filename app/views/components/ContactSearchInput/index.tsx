import React, { useEffect, useState } from 'react'

import {
  Box,
  TextField,
  Typography,
  Avatar,
  CircularProgress
} from '@material-ui/core'
import cn from 'classnames'
import { useDebounce } from 'react-use'

import { mdiPlus } from '@mdi/js'

import useAsync from 'hooks/use-async'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { searchContacts } from 'models/contacts/search-contacts'

import useStyles from './styles'

interface ContactSearchInputProps {
  placeholder?: string
  onChange: (contact: IContact) => void
  onNew?: (fullName: string) => void
}

function ContactSearchInput({
  placeholder = 'Search Contact',
  onChange,
  onNew
}: ContactSearchInputProps) {
  const classes = useStyles()

  const [searchCriteria, setSearchCriteria] = useState('')
  const [
    debouncedSearchCriteria,
    setDebouncedSearchCriteria
  ] = useState<string>('')

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

  const { data: contacts, run, reset, isLoading } = useAsync<IContact[]>({
    data: []
  })

  useEffect(() => {
    run(async () => (await searchContacts(debouncedSearchCriteria)).data)
  }, [run, debouncedSearchCriteria])

  const handleNewClick = () => {
    onNew?.(debouncedSearchCriteria)
  }

  const handleChange = (contact: IContact) => {
    setSearchCriteria('')
    reset()

    onChange(contact)
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

      {onNew && debouncedSearchCriteria && (
        <Box
          display="flex"
          alignItems="center"
          className={cn(classes.row, classes.newClient)}
          onClick={handleNewClick}
        >
          <Avatar className={classes.newClientAvatar}>
            <SvgIcon path={mdiPlus} className={classes.newClient} />
          </Avatar>

          <div className={classes.rowContent}>
            Add <strong>{searchCriteria}</strong>
          </div>
        </Box>
      )}

      {isLoading && (
        <Box display="flex" justifyContent="center">
          <CircularProgress disableShrink />
        </Box>
      )}

      {contacts.map(contact => (
        <Box
          key={contact.id}
          display="flex"
          alignItems="center"
          className={classes.row}
          onClick={() => handleChange(contact)}
        >
          <Avatar
            src={contact.profile_image_url ?? undefined}
            alt={contact.display_name}
          />

          <div className={classes.rowContent}>
            <Typography variant="body2">{contact.display_name}</Typography>

            <Typography variant="body2" className={classes.email}>
              {contact.email}
            </Typography>
          </div>
        </Box>
      ))}
    </Box>
  )
}

export default ContactSearchInput
