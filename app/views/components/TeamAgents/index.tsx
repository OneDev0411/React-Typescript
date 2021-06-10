import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { IAppState } from 'reducers'

import { getAgents } from 'models/Deal/agent'

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
  options?: Optional<IBrand[]>
}

export default function TeamAgents({
  children,
  isPrimaryAgent,
  criteria = '',
  flattenTeams = false,
  options
}: TeamAgentsProps) {
  const isOptionsProvided = !!options

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

    if (!isOptionsProvided) {
      getTeamAgents()
    }
  }, [isPrimaryAgent, user, isOptionsProvided])

  const finalTeamAgents = isOptionsProvided ? options! : teamAgents

  const isEmptyState = !isLoading && finalTeamAgents.length === 0

  return (
    <>
      {children({
        isLoading: !isOptionsProvided && isLoading,
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
