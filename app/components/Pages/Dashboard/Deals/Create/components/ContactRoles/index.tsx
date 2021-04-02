import React, { useState } from 'react'

import {
  Box,
  makeStyles,
  TextField,
  Theme,
  Typography,
  Avatar
} from '@material-ui/core'
import cn from 'classnames'
import { useAsync, useDebounce } from 'react-use'
import { mdiPlus } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { searchContacts } from 'models/contacts/search-contacts'
import searchAgents from 'models/agent/search'

import { convertContactToRole, convertAgentToRole } from '../../../utils/roles'

import { IDealFormRole } from '../../types'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      maxHeight: '60vh',
      overflow: 'auto',
      '&.has-border': {
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius
      }
    },
    row: {
      padding: theme.spacing(1),
      '&:hover': {
        background: theme.palette.action.hover,
        cursor: 'pointer'
      }
    },
    newClientAvatar: {
      border: `1px solid ${theme.palette.secondary.main}`,
      backgroundColor: '#fff'
    },
    newClient: {
      color: theme.palette.secondary.main
    },
    rowContent: {
      paddingLeft: theme.spacing(2)
    },
    email: {
      color: theme.palette.grey[500]
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
  const [
    debouncedSearchCriteria,
    setDebouncedSearchCriteria
  ] = useState<string>('')

  const [contacts, setContacts] = useState<IContact[]>([])
  const [agents, setAgents] = useState<IAgent[]>([])

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
    if (searchCriteria.length < 3) {
      return
    }

    if (source === 'MLS') {
      const agents = await searchAgents(searchCriteria, 'q')

      setAgents(agents)
    }

    if (source === 'CRM') {
      const { data: contacts } = await searchContacts(searchCriteria)

      setContacts(contacts)
    }
  }, [debouncedSearchCriteria])

  /**
   * Starts creating a new contact based on the given name
   */
  const createNewContact = () => {
    const name = debouncedSearchCriteria.split(' ')

    handleSelectRole({
      legal_first_name: name[0],
      legal_last_name: name[1]
    })
  }

  const handleSelectRole = (role: Partial<IDealFormRole>) => {
    setSearchCriteria('')
    setContacts([])

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

      {debouncedSearchCriteria && (
        <Box
          display="flex"
          alignItems="center"
          className={cn(classes.row, classes.newClient)}
          onClick={createNewContact}
        >
          <Avatar className={classes.newClientAvatar}>
            <SvgIcon path={mdiPlus} className={classes.newClient} />
          </Avatar>

          <div className={classes.rowContent}>
            Add <strong>{searchCriteria}</strong>
          </div>
        </Box>
      )}

      {contacts.map(contact => (
        <Box
          key={contact.id}
          display="flex"
          className={classes.row}
          onClick={() => handleSelectRole(convertContactToRole(contact))}
        >
          <Avatar src={contact.profile_image_url!} alt={contact.display_name} />

          <div className={classes.rowContent}>
            <Typography variant="body2">{contact.display_name}</Typography>

            <Typography variant="body2" className={classes.email}>
              {contact.email}
            </Typography>
          </div>
        </Box>
      ))}

      {agents.map(agent => (
        <Box
          key={agent.id}
          display="flex"
          className={classes.row}
          onClick={() => handleSelectRole(convertAgentToRole(agent))}
        >
          <Avatar src={agent.profile_image_url!} />

          <div className={classes.rowContent}>
            <Typography variant="body2">{agent.full_name}</Typography>

            <Typography variant="body2" className={classes.email}>
              {agent.mlsid || agent.email}
            </Typography>
          </div>
        </Box>
      ))}
    </Box>
  )
}
