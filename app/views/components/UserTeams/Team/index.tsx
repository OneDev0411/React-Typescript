import React from 'react'

import Header from './Header'
import Member from './Member'
import { Container } from './styled'

interface Props {
  team: IUserTeam
  members: IUser[]
  isSelected: boolean
  onSelectChange: (team: IUserTeam) => void
}

export default function Team({
  team,
  members,
  onSelectChange,
  isSelected
}: Props) {
  return (
    <Container>
      <Header
        team={team}
        membersCount={members.length}
        isSelected={isSelected}
        onSelectChange={onSelectChange}
      />
      {members.map(user => (
        <Member key={user.id} user={user} />
      ))}
    </Container>
  )
}
