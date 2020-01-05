import React from 'react'

import Header from './Header'
import Member from './Member'
import { Container } from './styled'

interface Props {
  brand: IBrand
  members: IUser[]
  isSelected: boolean
  onSelectChange: (brand: IBrand) => void
}

export default function Team({
  brand,
  members,
  isSelected,
  onSelectChange
}: Props) {
  return (
    <Container>
      <Header
        brand={brand}
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
