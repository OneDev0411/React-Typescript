import React from 'react'

import Header from './Header'
import Member from './Member'
import { Container } from './styled'

interface Props {
  brand: IBrand
  members: IUser[]
  isSelected: boolean
  searchQuery: string
  onSelectChange: (brand: IBrand) => void
}

export default function Team({
  brand,
  members,
  isSelected,
  searchQuery,
  onSelectChange
}: Props) {
  return (
    <Container>
      <Header
        brand={brand}
        membersCount={members.length}
        isSelected={isSelected}
        searchQuery={searchQuery}
        onSelectChange={onSelectChange}
      />
      {members.map(user => (
        <Member key={user.id} user={user} searchQuery={searchQuery} />
      ))}
    </Container>
  )
}
