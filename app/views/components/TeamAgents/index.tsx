import React, { useState, useEffect } from 'react'

import { searchContacts } from 'models/contacts/search-contacts'
import { normalizeContactAttribute } from 'actions/contacts/helpers/normalize-contacts'

import { getActiveTeam } from 'utils/user-teams'

import Drawer from 'components/OverlayDrawer'
import Loading from 'components/LoadingContainer'

import { getAgents } from 'models/Deal/agent'

import { AgentsList } from './List'

import { EmptyState } from './styled'

interface Props {
  user: IUser
  title?: string
  isPrimaryAgent?: boolean
  flattened?: boolean
  onSelectAgent(user: IUser, contacts: IContact[]): void
  onClose(): void
}

export default function TeamAgents({
  user,
  title = 'Team Agents',
  isPrimaryAgent = false,
  flattened = false,
  onClose,
  onSelectAgent
}: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isSearchingContacts, setIsSearchingContacts] = useState<boolean>(true)
  const [teamAgents, setTeamAgents] = useState<IBrand[]>([])

  useEffect(() => {
    const getTeamAgents = async () => {
      try {
        setIsLoading(true)

        const agents = await getAgents(getBrand(user, isPrimaryAgent))

        setTeamAgents(agents)
      } catch (e) {
        console.log(e)
        setTeamAgents([])
      }

      setIsLoading(false)
    }

    getTeamAgents()
  }, [isPrimaryAgent, user])

  const isEmptyState =
    !isLoading && !isSearchingContacts && teamAgents.length === 0

  const handleSelectAgent = async (user: IUser) => {
    setIsSearchingContacts(true)

    let contacts: IContact[] = []

    try {
      const response = await searchContacts(user.email)

      contacts = normalizeContactAttribute(response).filter(
        (contact: IContact) => (contact.emails || []).includes(user.email)
      )
    } catch (e) {}

    await onSelectAgent(user, contacts)

    setIsSearchingContacts(false)
  }

  return (
    <Drawer open onClose={onClose}>
      <Drawer.Header title={title} />

      <Drawer.Body>
        {isEmptyState && (
          <EmptyState>We could not find any agent in your brand</EmptyState>
        )}

        {isLoading ? (
          <Loading style={{ padding: '35% 0' }} />
        ) : (
          <AgentsList
            user={user}
            teams={teamAgents}
            isLoading={isLoading}
            flattened={flattened}
            onSelectAgent={handleSelectAgent}
          />
        )}
      </Drawer.Body>
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
