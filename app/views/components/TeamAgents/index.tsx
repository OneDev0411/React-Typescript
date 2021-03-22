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
interface Props {
  isPrimaryAgent: boolean
  flattenTeams?: boolean
  criteria?: string
  children: (props: RenderProps) => React.ReactNode
}

export default function TeamAgents({
  children,
  isPrimaryAgent,
  criteria = '',
  flattenTeams = false
}: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [teamAgents, setTeamAgents] = useState<IBrand[]>([])

  const user = useSelector<IAppState, IUser>(({ user }) => user!)

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

  const isEmptyState = !isLoading && teamAgents.length === 0

  return (
    <>
      {children({
        isLoading,
        isEmptyState,
        teams: normalizeTeams(
          user,
          teamAgents,
          flattenTeams,
          criteria
        ) as NormalizedBrand[]
      })}
    </>
  )
}
