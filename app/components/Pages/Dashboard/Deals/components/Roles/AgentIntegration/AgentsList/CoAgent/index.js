import React from 'react'
import memoize from 'lodash/memoize'
import PropTypes from 'prop-types'

import { getBrandAvailableMembers } from 'utils/user-teams'

import Search from 'components/Grid/Search'

import {
  Card,
  Header,
  Body,
  Title,
  SubTitle,
  RowItem,
  AgentTitle
} from './styled'

CoAgent.propTypes = {
  agents: PropTypes.array.isRequired,
  onSearch: PropTypes.func.isRequired,
  onSelectAgent: PropTypes.func.isRequired
}

export function CoAgent(props) {
  return (
    <div>
      <Search
        onChange={props.onSearch}
        style={{ marginBottom: '1rem' }}
        placeholder="Search for teams or agents"
      />

      {props.agents.map((office, officeIndex) => {
        const agents = getBrandAvailableMembers(office).filter(
          user => user.user_type === 'Agent'
        )

        if (!agents.length) {
          return false
        }

        return (
          <Card key={officeIndex}>
            <Header>
              <Title>{office.name}</Title>
              <SubTitle>{getSubtitle(office)}</SubTitle>
            </Header>
            <Body>
              {agents.map((user, userIndex) => (
                <RowItem key={`${officeIndex}${userIndex}`}>
                  <AgentTitle onClick={() => props.onSelectAgent(user)}>
                    {user.display_name}
                  </AgentTitle>
                  <SubTitle>{user.email}</SubTitle>
                </RowItem>
              ))}
            </Body>
          </Card>
        )
      })}
    </div>
  )
}

const getSubtitle = memoize(
  office => {
    const names = []
    let currentOffice = office

    while (currentOffice.parent !== null) {
      names.push(currentOffice.name)
      currentOffice = currentOffice.parent
    }

    return names.reverse().join(' > ')
  },
  office => office.id
)
