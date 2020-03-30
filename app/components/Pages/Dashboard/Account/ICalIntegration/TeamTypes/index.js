import React from 'react'
import uniqBy from 'lodash/uniqBy'
import flatten from 'lodash/flatten'

import { getBrandUsers } from 'utils/user-teams'

import { Section } from '../styled'
import Title from '../Title'
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

  const AllMembersIds = flatten(Object.values(allMembers))
  const selectedMembersIds = flatten(Object.values(selectedMembers))
  const allMembersSelected = AllMembersIds.every(id =>
    selectedMembersIds.includes(id)
  )

  return (
    <Section>
      <Title>Which teams did you want to send calendar events from?</Title>
      <MemberRow
        selected={allMembersSelected}
        title="All Teams"
        onChange={() => {
          if (!allMembersSelected) {
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
                selected={isTeamSelected}
                title={brand.name}
                onChange={() => {
                  if (!isTeamSelected) {
                    onSelectTeam(teamMembers)
                  } else {
                    onRemoveTeam(Object.keys(teamMembers))
                  }
                }}
                typographyVariant="subtitle1"
                style={{ marginBottom: '0.25em' }}
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
