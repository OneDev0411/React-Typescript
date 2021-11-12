import React, { useState, useEffect } from 'react'

import { useSelector } from 'react-redux'

import { getAgents } from 'models/Deal/agent'
import { IAppState } from 'reducers'

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
}

export default function TeamAgents({
  children,
  isPrimaryAgent,
  criteria = '',
  flattenTeams = false,
  teamAgentsModelFn = getAgents
}: TeamAgentsProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [teamAgents, setTeamAgents] = useState<IBrand[]>([])

  const user = useSelector<IAppState, IUser>(({ user }) => user!)

  useEffect(() => {
    const getTeamAgents = async () => {
      try {
        setIsLoading(true)

        const agents = await teamAgentsModelFn(getBrand(user, isPrimaryAgent))

        setTeamAgents(agents || [])
      } catch (e) {
        console.log(e)
        setTeamAgents([])
      } finally {
        setIsLoading(false)
      }
    }

    getTeamAgents()
  }, [isPrimaryAgent, user, teamAgentsModelFn])

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
