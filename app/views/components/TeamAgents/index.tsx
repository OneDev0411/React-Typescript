import React, { useState, useEffect } from 'react'

import { useUnsafeActiveTeam } from '@app/hooks/team/use-unsafe-active-team'
import { getAgents } from 'models/Deal/agent'

import { getBrand } from './helpers/get-brand'
import type { NormalizedBrand } from './types'
import useTeamAgentsSearch from './use-team-agents-search'

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
  teamAgentsModelFn?: (brandId: Nullable<UUID>) => Promise<IBrand[]>
  filterTeamsFn?: (teams: NormalizedBrand[]) => NormalizedBrand[]
}

export default function TeamAgents({
  children,
  isPrimaryAgent,
  criteria = '',
  flattenTeams = false,
  teamAgentsModelFn = getAgents,
  filterTeamsFn
}: TeamAgentsProps) {
  const activeTeam = useUnsafeActiveTeam()

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [teamAgents, setTeamAgents] = useState<IBrand[]>([])

  useEffect(() => {
    const getTeamAgents = async () => {
      try {
        setIsLoading(true)

        const agents = await teamAgentsModelFn(
          getBrand(activeTeam, isPrimaryAgent)
        )

        setTeamAgents(agents || [])
      } catch (e) {
        console.log(e)
        setTeamAgents([])
      } finally {
        setIsLoading(false)
      }
    }

    getTeamAgents()
  }, [isPrimaryAgent, activeTeam, teamAgentsModelFn])

  const isEmptyState = !isLoading && teamAgents.length === 0
  const teams = useTeamAgentsSearch(teamAgents, criteria, flattenTeams)

  return (
    <>
      {children({
        isLoading,
        isEmptyState,
        teams: filterTeamsFn ? filterTeamsFn(teams) : teams
      })}
    </>
  )
}
