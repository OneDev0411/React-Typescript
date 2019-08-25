import React from 'react'

import Link from 'components/ALink'

interface Props {
  id: UUID
  name: string
  description: string
}

export default function Name({ id, name, description }: Props) {
  return (
    <>
      <div>
        <Link to={`/dashboard/account/flows/${id}`} style={{ fontWeight: 'bold' }}>
          {name}
        </Link>
      </div>
      <div>{description}</div>
    </>
  )
}
