import React, { useState, useEffect } from 'react'
import { Button } from '@material-ui/core'
import pluralize from 'pluralize'

import { searchContacts } from 'models/contacts/search-contacts'
import { normalizeContactAttribute } from 'actions/contacts/helpers/normalize-contacts'

import { getActiveTeam } from 'utils/user-teams'

import Drawer from 'components/OverlayDrawer'
import Loading from 'components/LoadingContainer'

import { getAgents } from 'models/Deal/agent'

import { IUserWithBrand, AgentItem } from './types'

import { AgentsList } from './List'

import { EmptyState } from './styled'

interface Props {
  user: IUser
  title?: string
  isPrimaryAgent?: boolean
  multiSelection?: boolean
  withRelatedContacts?: boolean
  flattened?: boolean
  onSelectAgents(agents: AgentItem[]): void
  onClose(): void
}

export default function TeamAgents({
  user,
  title = 'Team Agents',
  withRelatedContacts = true,
  multiSelection = false,
  isPrimaryAgent = false,
  flattened = false,
  onClose,
  onSelectAgents
}: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isSearchingContacts, setIsSearchingContacts] = useState<boolean>(false)
  const [teamAgents, setTeamAgents] = useState<IBrand[]>([])
  const [selectedAgents, setSelectedAgents] = useState<IUserWithBrand[]>([])

  useEffect(() => {
    const getTeamAgents = async () => {
      try {
        setIsLoading(true)

        const agents = await getAgents(getBrand(user, isPrimaryAgent))

        setTeamAgents(agents || [])
      } catch (e) {
        console.log(e)
        setTeamAgents([])
      } finally {
        setIsLoading(false)
      }
    }

    getTeamAgents()
  }, [isPrimaryAgent, user])

  const isWorking = isSearchingContacts || isLoading

  const isEmptyState =
    !isLoading && !isSearchingContacts && teamAgents.length === 0

  const handleMultiSelectAgents = () => {
    onSelectAgents(selectedAgents.map(agent => ({ agent, contacts: [] })))
  }

  const handleSelectAgent = async (user: IUserWithBrand) => {
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
    } catch (e) {}

    await onSelectAgents([
      {
        agent: user,
        contacts
      }
    ])

    setIsSearchingContacts(false)
  }

  return (
    <Drawer open onClose={onClose}>
      <Drawer.Header title={title} />

      <Drawer.Body>
        {isEmptyState && (
          <EmptyState>We could not find any agent in your brand</EmptyState>
        )}

        {isWorking ? (
          <Loading style={{ padding: '35% 0' }} />
        ) : (
          <AgentsList
            multiSelection={multiSelection}
            user={user}
            teams={teamAgents}
            selectedAgents={selectedAgents}
            isLoading={isLoading}
            flattened={flattened}
            onSelectAgent={handleSelectAgent}
          />
        )}
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

function getBrand(user: IUser, isPrimaryAgent: boolean): UUID | null {
  const team = getActiveTeam(user)

  if (!team) {
    return null
  }

  if (isPrimaryAgent) {
    return team.brand.id
  }

  let brand = team.brand

  while (brand.parent !== null) {
    brand = brand.parent
  }

  return brand.id
}
