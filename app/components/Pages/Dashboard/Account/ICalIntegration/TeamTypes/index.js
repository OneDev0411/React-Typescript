import React, { Fragment } from 'react'
import _ from 'underscore'
import { SectionTitle } from '../styled'
import MemberRow from './MemberRow'

const TeamTypes = ({
  userTeams,
  selectedMembers,
  onChangeSelectAllMembers,
  onChangeSelectedMember,
  onChangeSelectRole
}) => {
  let allMembers = {}

  userTeams.forEach(({ brand }) => {
    brand.roles.forEach(
      role => (allMembers[role.id] = role.members.map(({ id }) => id))
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
          if (allMembers.length !== selectedMembers.length) {
            onChangeSelectAllMembers(allMembers)
          } else {
            onChangeSelectAllMembers({})
          }
        }}
      />
      {_.map(userTeams, team => (
        <React.Fragment key={team.brand.id}>
          <div style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
            {team.brand.name}
          </div>
          {team.brand.member_count > 1 && (
            <div style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
              {team.brand.roles.map(role => (
                <div key={role.id}>
                  <MemberRow
                    style={{ fontWeight: 'bold' }}
                    selected={role.members.every(
                      member =>
                        selectedMembers[role.id] &&
                        selectedMembers[role.id].includes(member.id)
                    )}
                    title={role.role}
                    onClick={() =>
                      onChangeSelectRole(
                        role.id,
                        role.members.map(({ id }) => id)
                      )
                    }
                  />

                  {role.members.map((member, index) => (
                    <MemberRow
                      key={`${member.id}-${index}`}
                      selected={
                        selectedMembers[role.id] &&
                        selectedMembers[role.id].includes(member.id)
                      }
                      title={member.display_name}
                      onClick={() => onChangeSelectedMember(role.id, member.id)}
                      style={{ marginLeft: '1rem' }}
                    />
                  ))}
                </div>
              ))}
            </div>
          )}
        </React.Fragment>
      ))}
    </Fragment>
  )
}

export default TeamTypes
