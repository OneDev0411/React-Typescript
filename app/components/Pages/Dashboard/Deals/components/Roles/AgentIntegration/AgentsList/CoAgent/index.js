import React, { useState } from 'react'
import memoize from 'lodash/memoize'
import PropTypes from 'prop-types'
import Fuse from 'fuse.js'
import useDebouncedCallback from 'use-debounce/lib/callback'

import Avatar from 'components/Avatar'
import { getBrandAvailableMembers } from 'utils/user-teams'

import Search from 'components/Grid/Search'

import { EmptyState } from '../styled'

import {
  Card,
  Header,
  Title,
  SubTitle,
  RowItem,
  AgentTitle,
  AgentEmail
} from './styled'

CoAgent.propTypes = {
  agents: PropTypes.array.isRequired,
  onSearch: PropTypes.func.isRequired,
  onSelectAgent: PropTypes.func.isRequired
}

export function CoAgent(props) {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSetSearchTerm] = useDebouncedCallback(setSearchTerm, 500)

  const teams = normalizeTeams(props.teams, searchTerm)

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
              <Title>{office.name}</Title>
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
                  <AgentTitle>{user.display_name}</AgentTitle>
                  <AgentEmail>{user.email}</AgentEmail>
                </div>
              </RowItem>
            ))}
          </Card>
        )
      })}
    </div>
  )
}

function normalizeTeams(teams, searchTerm) {
  const list = teams.map(office => {
    const agents = getBrandAvailableMembers(office).map(user => ({
      ...user,
      office: office.name
    }))

    return {
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

const getSubtitle = memoize(
  office => {
    const names = []
    let currentOffice = office

    while (currentOffice.parent !== null) {
      names.push(currentOffice.name)
      currentOffice = currentOffice.parent
    }

    return names.length > 1 ? names.reverse().join(' > ') : ''
  },
  office => office.id
)
