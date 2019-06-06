import React from 'react'
import uniqBy from 'lodash/uniqBy'
import isEqual from 'lodash/isEqual'

import { getBrandUsers } from 'utils/user-teams'

import { Section, Title } from '../styled'
import MemberRow from './MemberRow'

const TeamTypes = ({
  userTeams,
  selectedMembers,
  onChangeSelectAllMembers,
  onChangeSelectedMember,
  onSelectTeam,
  onRemoveTeam
}) => {
  const allMembers = userTeams.reduce(
    (acc, { brand }) => ({
      ...acc,
      [brand.id]: getBrandUsers(brand).map(({ id }) => id)
    }),
    {}
  )

  return (
    <Section>
      <Title>Which teams did you want to send calendar events from?</Title>
      <MemberRow
        selected={isEqual(allMembers, selectedMembers)}
        title="All Teams"
        onChange={() => {
          if (!isEqual(allMembers, selectedMembers)) {
            onChangeSelectAllMembers(allMembers)
          } else {
            onChangeSelectAllMembers({})
          }
        }}
        style={{ marginBottom: '1rem' }}
      />
      <div>
        {userTeams.map(({ brand }) => {
          let members = getBrandUsers(brand)

          const teamMembers = { [brand.id]: members.map(({ id }) => id) }
          const isTeamSelected =
            selectedMembers[brand.id] &&
            members.every(member =>
              selectedMembers[brand.id].includes(member.id)
            )

          members = uniqBy(members, 'id')

          return (
            <div
              key={brand.id}
              style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}
            >
              <MemberRow
                style={{
                  fontWeight: 500,
                  fontSize: '1.25rem',
                  marginBottom: '0.25em'
                }}
                selected={isTeamSelected}
                title={brand.name}
                onChange={() => {
                  if (!isTeamSelected) {
                    onSelectTeam(teamMembers)
                  } else {
                    onRemoveTeam(Object.keys(teamMembers))
                  }
                }}
              />
              {brand.member_count > 0 && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginLeft: '2rem'
                  }}
                >
                  {members.map((member, index) => (
                    <MemberRow
                      key={`${member.id}-${index}`}
                      selected={
                        selectedMembers[brand.id] &&
                        selectedMembers[brand.id].includes(member.id)
                      }
                      title={member.display_name}
                      onChange={() =>
                        onChangeSelectedMember(brand.id, member.id)
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </Section>
  )
}

export default TeamTypes
