import React, { useState } from 'react'

import { Button, CircularProgress, Box } from '@material-ui/core'
import pluralize from 'pluralize'

import useDebouncedCallback from 'use-debounce/lib/callback'

import Drawer from 'components/OverlayDrawer'
import TeamAgents from 'components/TeamAgents'
import { Agent, BrandedUser } from 'components/TeamAgents/types'

import { searchContacts } from 'models/contacts/search-contacts'
import { normalizeContactAttribute } from 'actions/contacts/helpers/normalize-contacts'

import { AgentsList } from './List'

interface Props {
  title: string
  multiSelection: boolean
  withRelatedContacts?: boolean
  flattened?: boolean
  isPrimaryAgent?: boolean
  isDrawerOpen?: boolean
  onClose: () => void
  onSelectAgents(agents: Agent[]): void
}

export function TeamAgentsDrawer({
  title = 'Select Agent',
  multiSelection = false,
  withRelatedContacts = true,
  flattened = false,
  isPrimaryAgent = false,
  isDrawerOpen = true,
  onClose,
  onSelectAgents
}: Props) {
  const [selectedAgents, setSelectedAgents] = useState<BrandedUser[]>([])
  const [isSearchingContacts, setIsSearchingContacts] = useState<boolean>(false)
  const [searchCriteria, setSearchCriteria] = useState<string>('')
  const [debouncedSetSearchCriteria] = useDebouncedCallback(
    setSearchCriteria,
    500
  )

  const handleMultiSelectAgents = () => {
    const agents = selectedAgents.map(agent => ({ agent, contacts: [] }))

    onSelectAgents(agents)
  }

  const handleSelectAgent = async (user: BrandedUser) => {
    if (multiSelection) {
      const isSelected = selectedAgents.some(agent => agent.id === user.id)

      setSelectedAgents(
        isSelected
          ? selectedAgents.filter(agent => agent.id !== user.id)
          : [...selectedAgents, user]
      )

      return
    }

    if (!withRelatedContacts) {
      onSelectAgents([
        {
          agent: user,
          contacts: []
        }
      ])

      return
    }

    setIsSearchingContacts(true)

    let contacts: IContact[] = []

    try {
      const response = await searchContacts(user.email)

      contacts = normalizeContactAttribute(
        response
      ).filter((contact: IContact) =>
        (contact.emails || []).includes(user.email)
      )
    } catch (e) {
      console.log(e)
    }

    await onSelectAgents([
      {
        agent: user,
        contacts
      }
    ])

    setIsSearchingContacts(false)
  }

  return (
    <Drawer open={isDrawerOpen} onClose={onClose}>
      <Drawer.Header title={title} />

      <Drawer.Body>
        <TeamAgents
          flattenTeams={flattened}
          isPrimaryAgent={isPrimaryAgent}
          criteria={searchCriteria}
        >
          {({ isLoading, isEmptyState, teams }) => (
            <>
              {(isLoading || isSearchingContacts) && (
                <Box
                  display="flex"
                  height="100%"
                  justifyContent="center"
                  alignItems="center"
                >
                  <CircularProgress />
                </Box>
              )}

              {isEmptyState && (
                <Box my={2} textAlign="center">
                  We could not find any agent in your brand
                </Box>
              )}

              {!isEmptyState && (
                <AgentsList
                  teams={teams}
                  searchCriteria={searchCriteria}
                  multiSelection={multiSelection}
                  selectedAgents={selectedAgents}
                  onSelectAgent={handleSelectAgent}
                  onChangeCriteria={debouncedSetSearchCriteria}
                />
              )}
            </>
          )}
        </TeamAgents>
      </Drawer.Body>

      {multiSelection && (
        <Drawer.Footer style={{ flexDirection: 'row-reverse' }}>
          <Button
            variant="contained"
            color="primary"
            disabled={selectedAgents.length === 0}
            onClick={handleMultiSelectAgents}
          >
            {selectedAgents.length === 0
              ? 'No Agent Selected'
              : `Select ${pluralize('Agent', selectedAgents.length, true)}`}
          </Button>
        </Drawer.Footer>
      )}
    </Drawer>
  )
}
