import React, { Fragment } from 'react'
import _ from 'underscore'
import { SectionTitle } from '../styled'
import MemberRow from './MemberRow'

const TeamTypes = ({
  userTeams,
  selectedMembers,
  onChangeSelectAllMembers,
  onChangeSelectedMember,
  onSelectTeam,
  onRemoveTeam
}) => {
  let allMembers = {}

  userTeams.forEach(({ brand }) => {
    brand.roles.forEach(
      role =>
        (allMembers[brand.id] = (allMembers[brand.id] || []).concat(
          role.members.map(({ id }) => id)
        ))
    )
  })

  return (
    <Fragment>
      <SectionTitle>
        Which teams did you want to send calendar events from?
      </SectionTitle>
      <MemberRow
        selected={_.isEqual(allMembers, selectedMembers)}
        title="All Teams"
        style={{ marginBottom: '1rem' }}
        onClick={() => {
          if (!_.isEqual(allMembers, selectedMembers)) {
            onChangeSelectAllMembers(allMembers)
          } else {
            onChangeSelectAllMembers({})
          }
        }}
      />
      {_.map(userTeams, team => {
        let members = []

        team.brand.roles.forEach(
          role => (members = members.concat(role.members.map(({ id }) => id)))
        )

        const teamMembers = { [team.brand.id]: members }
        const isTeamSelected =
          selectedMembers[team.brand.id] &&
          members.every(member =>
            selectedMembers[team.brand.id].includes(member)
          )

        return (
          <React.Fragment key={team.brand.id}>
            <MemberRow
              style={{ fontWeight: 'bold', fontSize: '1.25rem' }}
              selected={isTeamSelected}
              title={team.brand.name}
              onClick={() => {
                if (!isTeamSelected) {
                  onSelectTeam(teamMembers)
                } else {
                  onRemoveTeam(Object.keys(teamMembers))
                }
              }}
            />
            {team.brand.member_count > 1 && (
              <div style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
                {team.brand.roles.map(role => (
                  <div key={role.id}>
                    {role.members.map((member, index) => (
                      <MemberRow
                        key={`${member.id}-${index}`}
                        selected={
                          selectedMembers[team.brand.id] &&
                          selectedMembers[team.brand.id].includes(member.id)
                        }
                        title={member.display_name}
                        onClick={() =>
                          onChangeSelectedMember(team.brand.id, member.id)
                        }
                        style={{ marginLeft: '1rem' }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            )}
          </React.Fragment>
        )
      })}
    </Fragment>
  )
}

export default TeamTypes
