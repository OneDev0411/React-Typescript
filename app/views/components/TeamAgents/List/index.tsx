import React, { useState } from 'react'
import memoize from 'lodash/memoize'
import Fuse from 'fuse.js'
import useDebouncedCallback from 'use-debounce/lib/callback'
import uniqBy from 'lodash/uniqBy'

import Avatar from 'components/Avatar'
import { TextWithHighlights } from 'components/TextWithHighlights'

import Search from 'components/Grid/Search'

import { getBrandUsers, isActiveTeamTraining } from 'utils/user-teams'

import { EmptyState } from '../styled'

import {
  AgentEmail,
  AgentTitle,
  Card,
  Header,
  RowItem,
  SubTitle,
  Title
} from './styled'

interface NormalizedBrand {
  id?: UUID
  name?: string
  subtitle?: string
  users: IUser[]
}

interface Props {
  user: IUser
  teams: IBrand[]
  isLoading: boolean
  flattened: boolean
  onSelectAgent(agent: IDealAgent): void
}

export function AgentsList(props: Props) {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [debouncedSetSearchTerm] = useDebouncedCallback(setSearchTerm, 500)

  const teams = normalizeTeams(
    props.user,
    props.teams,
    props.flattened,
    searchTerm
  )

  return (
    <div>
      {/*
      // @ts-ignore js component */}
      <Search
        value={searchTerm}
        onChange={debouncedSetSearchTerm}
        style={{ marginBottom: '1rem' }}
        placeholder="Search for teams or agents"
      />

      {!props.isLoading && !teams.length && (
        <EmptyState>No search result</EmptyState>
      )}

      {teams.map((office: NormalizedBrand, officeIndex: number) => {
        if (office.users.length === 0) {
          return null
        }

        return (
          <Card key={officeIndex}>
            {office.name && (
              <Header>
                <Title>
                  <TextWithHighlights search={searchTerm}>
                    {office.name}
                  </TextWithHighlights>
                </Title>
                <SubTitle>{office.subtitle}</SubTitle>
              </Header>
            )}

            {office.users.map((user: IUser, userIndex: number) => (
              <RowItem
                key={`${officeIndex}${userIndex}`}
                onClick={() =>
                  props.onSelectAgent({
                    ...user,
                    brand_id: office.id
                  })
                }
              >
                <Avatar
                  size={40}
                  title={user.display_name}
                  image={user.profile_image_url || undefined}
                  style={{
                    marginRight: '1rem'
                  }}
                />

                <div>
                  <AgentTitle to="">
                    <TextWithHighlights search={searchTerm}>
                      {user.display_name}
                    </TextWithHighlights>
                  </AgentTitle>

                  <AgentEmail>
                    <TextWithHighlights search={searchTerm}>
                      {user.email}
                    </TextWithHighlights>
                  </AgentEmail>
                </div>
              </RowItem>
            ))}
          </Card>
        )
      })}
    </div>
  )
}

function normalizeTeams(
  user: IUser,
  teams: IBrand[],
  flattened: boolean,
  searchTerm: string
): NormalizedBrand[] {
  const isTraining = isActiveTeamTraining(user)

  const list = teams
    .filter((office: IBrand) => isTrainingOffice(office) === isTraining)
    .map((office: IBrand) => {
      const agents = getBrandUsers(office).map(user => ({
        ...user,
        office: office.name
      }))

      return {
        id: office.id,
        name: office.name,
        subtitle: getSubtitle(office),
        users: searchTerm
          ? new Fuse(agents, {
              keys: ['office', 'display_name', 'email'],
              threshold: 0.1
            }).search(searchTerm)
          : agents
      }
    })

  const filteredList = list.every(office => !office.users.length) ? [] : list

  // merge all teams into one and show them flattened
  if (flattened) {
    return [
      {
        users: uniqBy(
          filteredList.flatMap(team => team.users),
          (user: IUser) => user.id
        )
      }
    ]
  }

  return filteredList
}

const isTrainingOffice = memoize(
  office => {
    let current = office

    do {
      if (current.training) {
        return true
      }

      current = current.parent
    } while (current !== null)

    return false
  },
  office => office.id
)

const getSubtitle = memoize(
  office => {
    const names: string[] = []
    let currentOffice = office

    while (currentOffice.parent !== null) {
      names.push(currentOffice.name)
      currentOffice = currentOffice.parent
    }

    return names.length > 1
      ? names
          .reverse()
          .slice(0, -1)
          .join(' > ')
      : ''
  },
  office => office.id
)
