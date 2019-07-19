import React, { useState } from 'react'
import memoize from 'lodash/memoize'
import PropTypes from 'prop-types'
import Fuse from 'fuse.js'
import useDebouncedCallback from 'use-debounce/lib/callback'

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

AgentsList.propTypes = {
  agents: PropTypes.array.isRequired,
  onSearch: PropTypes.func.isRequired,
  onSelectAgent: PropTypes.func.isRequired
}

export function AgentsList(props) {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSetSearchTerm] = useDebouncedCallback(setSearchTerm, 500)

  const teams = normalizeTeams(props.user, props.teams, searchTerm)

  return (
    <div>
      <Search
        value={props.searchTerm}
        onChange={debouncedSetSearchTerm}
        style={{ marginBottom: '1rem' }}
        placeholder="Search for teams or agents"
      />

      {!props.isLoading && !teams.length && (
        <EmptyState>No search result</EmptyState>
      )}

      {teams.map((office, officeIndex) => {
        if (!office.users.length) {
          return false
        }

        return (
          <Card key={officeIndex}>
            <Header>
              <Title>
                <TextWithHighlights search={searchTerm}>
                  {office.name}
                </TextWithHighlights>
              </Title>
              <SubTitle>{office.subtitle}</SubTitle>
            </Header>

            {office.users.map((user, userIndex) => (
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
                  image={user.profile_image_url}
                  style={{
                    marginRight: '1rem'
                  }}
                />

                <div>
                  <AgentTitle>
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

function normalizeTeams(user, teams, searchTerm) {
  const isTraining = isActiveTeamTraining(user)

  const list = teams
    .filter(office => isTrainingOffice(office) === isTraining)
    .map(office => {
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

  return list.every(office => !office.users.length) ? [] : list
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
    const names = []
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
