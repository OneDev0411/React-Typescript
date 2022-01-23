import { useState, useEffect, ReactNode } from 'react'

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
  bareMode?: boolean
  criteria?: string
  currentAgents?: IBrand[]
  children: (props: RenderProps) => ReactNode

  teamAgentsModelFn?: (brandId: Nullable<UUID>) => Promise<IBrand[]>
  filterTeamsFn?: (teams: NormalizedBrand[]) => NormalizedBrand[]
}

export default function TeamAgents({
  children,
  isPrimaryAgent,
  bareMode = false,
  flattenTeams = false,
  criteria = '',
  currentAgents = [],
  teamAgentsModelFn = getAgents,
  filterTeamsFn
}: TeamAgentsProps) {
  const activeTeam = useUnsafeActiveTeam()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [teamAgents, setTeamAgents] = useState<IBrand[]>(() => currentAgents)

  useEffect(() => {
    const getTeamAgents = async () => {
      try {
        setIsLoading(true)

        const agents = await teamAgentsModelFn(
          getBrand(activeTeam, isPrimaryAgent)
        )

        if (agents.length > 0) {
          if (teamAgents.length > 0) {
            setTeamAgents(prevAgents => [...prevAgents, ...agents])
          } else {
            setTeamAgents(agents)
          }
        }
      } catch (e) {
        console.log(e)
      } finally {
        setIsLoading(false)
      }
    }

    if (!bareMode) {
      getTeamAgents()
    }
  }, [
    isPrimaryAgent,
    activeTeam,
    teamAgentsModelFn,
    bareMode,
    teamAgents.length
  ])

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
