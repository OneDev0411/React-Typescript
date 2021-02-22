import React from 'react'
import { Checkbox } from '@material-ui/core'

import { TextWithHighlights } from 'components/TextWithHighlights'
import { Avatar } from 'components/Avatar'

import Search from 'components/Grid/Search'

// import { IUserWithBrand } from '../types'

// import { EmptyState } from '../styled'
import { NormalizedBrand, BrandedUser } from 'components/TeamAgents/types'

import {
  AgentEmail,
  AgentTitle,
  Card,
  Header,
  RowItem,
  SubTitle,
  Title
} from './styled'

interface Props {
  teams: NormalizedBrand[]
  multiSelection: boolean
  selectedAgents: BrandedUser[]
  searchCriteria: string
  onChangeCriteria: (value: string) => void
  onSelectAgent: (agent: BrandedUser) => void
}

export function AgentsList({
  teams,
  multiSelection,
  searchCriteria,
  selectedAgents = [],
  onSelectAgent,
  onChangeCriteria
}: Props) {
  return (
    <div>
      <Search
        style={{ margin: '1rem 0' }}
        placeholder="Search for teams or agents"
        onChange={onChangeCriteria}
      />

      {teams.map((office, officeIndex) => {
        if (office.users.length === 0) {
          return null
        }

        return (
          <Card key={officeIndex}>
            {office.name && (
              <Header>
                <Title>
                  <TextWithHighlights search={searchCriteria}>
                    {office.name}
                  </TextWithHighlights>
                </Title>
                <SubTitle>{office.subtitle}</SubTitle>
              </Header>
            )}

            {office.users.map((user: IUser, userIndex: number) => {
              const isSelected =
                multiSelection &&
                selectedAgents.some(agent => agent.id === user.id)

              return (
                <RowItem
                  key={`${officeIndex}${userIndex}`}
                  onClick={() =>
                    onSelectAgent({
                      ...user,
                      brand_id: office.id
                    })
                  }
                >
                  {multiSelection && (
                    <Checkbox
                      color="primary"
                      style={{
                        padding: 0,
                        marginRight: '1rem'
                      }}
                      checked={isSelected}
                    />
                  )}

                  <Avatar
                    alt={user.display_name}
                    user={user}
                    style={{
                      marginRight: '1rem'
                    }}
                  />

                  <div>
                    <AgentTitle to="">
                      <TextWithHighlights search={searchCriteria}>
                        {user.display_name}
                      </TextWithHighlights>
                    </AgentTitle>

                    <AgentEmail>
                      <TextWithHighlights search={searchCriteria}>
                        {user.email}
                      </TextWithHighlights>
                    </AgentEmail>
                  </div>
                </RowItem>
              )
            })}
          </Card>
        )
      })}
    </div>
  )
}
