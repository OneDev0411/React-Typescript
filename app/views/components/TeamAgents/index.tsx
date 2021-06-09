import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { IAppState } from 'reducers'

import { getAgents } from 'models/Deal/agent'

import { selectActiveTeamUnsafe } from 'selectors/team'

import { getBrand } from './helpers/get-brand'
import { normalizeTeams } from './helpers/normalize-teams'

import type { NormalizedBrand } from './types'

interface RenderProps {
  isLoading: boolean
  isEmptyState: boolean
  teams: NormalizedBrand[]
}

export interface TeamAgentsProps {
  isPrimaryAgent: boolean
  flattenTeams?: boolean
  criteria?: string
  children: (props: RenderProps) => React.ReactNode
  isTeamAvailableMembers?: boolean
}

export default function TeamAgents({
  children,
  isPrimaryAgent,
  criteria = '',
  flattenTeams = false,
  isTeamAvailableMembers = false
}: TeamAgentsProps) {
  const activeTeam = useSelector(selectActiveTeamUnsafe)?.brand
  const activeTeams = activeTeam ? [activeTeam] : []

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [teamAgents, setTeamAgents] = useState<IBrand[]>([])

  const user = useSelector<IAppState, IUser>(({ user }) => user!)

  useEffect(() => {
    const getTeamAgents = async () => {
      try {
        setIsLoading(true)

        const agents = await getAgents(getBrand(user, isPrimaryAgent))

        console.log('agents', agents)
        setTeamAgents(agents || [])
      } catch (e) {
        console.log(e)
        setTeamAgents([])
      } finally {
        setIsLoading(false)
      }
    }

    if (!isTeamAvailableMembers) {
      getTeamAgents()
    }
  }, [isPrimaryAgent, user, isTeamAvailableMembers])

  const finalTeamAgents = !isTeamAvailableMembers ? teamAgents : activeTeams

  const isEmptyState = !isLoading && finalTeamAgents.length === 0

  return (
    <>
      {children({
        isLoading: !isTeamAvailableMembers && isLoading,
        isEmptyState,
        teams: normalizeTeams(
          user,
          finalTeamAgents,
          flattenTeams,
          criteria
        ) as NormalizedBrand[]
      })}
    </>
  )
}
