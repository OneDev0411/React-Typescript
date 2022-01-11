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
interface Props {
  isPrimaryAgent: boolean
  flattenTeams?: boolean
  criteria?: string
  children: (props: RenderProps) => ReactNode
}

export default function TeamAgents({
  children,
  isPrimaryAgent,
  criteria = '',
  flattenTeams = false
}: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [teamAgents, setTeamAgents] = useState<IBrand[]>([])
  const activeTeam = useUnsafeActiveTeam()

  useEffect(() => {
    const getTeamAgents = async () => {
      try {
        setIsLoading(true)

        const agents = await getAgents(getBrand(activeTeam, isPrimaryAgent))

        setTeamAgents(agents || [])
      } catch (e) {
        console.log(e)
        setTeamAgents([])
      } finally {
        setIsLoading(false)
      }
    }

    getTeamAgents()
  }, [isPrimaryAgent, activeTeam])

  const isEmptyState = !isLoading && teamAgents.length === 0
  const teams = useTeamAgentsSearch(teamAgents, criteria, flattenTeams)

  return (
    <>
      {children({
        isLoading,
        isEmptyState,
        teams
      })}
    </>
  )
}
