import React from 'react'

import Avatars from '../../../../../../../../views/components/Avatars'

export function Assignees(props) {
  return (
    <Avatars
      users={props.task.assignees}
      style={{
        position: 'absolute',
        top: '1.5em',
        right: '1.5em',
        cursor: 'pointer'
      }}
    />
  )
}
