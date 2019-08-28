import React from 'react'

import ActionButton from 'components/Button/ActionButton'

interface Props {
  id: UUID
  name: string
  description: string
}

export default function Name({ id, name, description }: Props) {
  return (
    <>
      <div>
        <ActionButton
          appearance="link"
          style={{ height: 'auto', padding: 0, fontWeight: 'bold' }}
          onClick={() => console.log(id)}
        >
          {name}
        </ActionButton>
      </div>
      <div>{description}</div>
    </>
  )
}
