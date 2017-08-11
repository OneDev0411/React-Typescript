import React from 'react'
import Members from '../Compose'

const Column = ({ role }) => (
  <div className="column">
    <div className='title'>
      {role.title}
    </div>
    <div className="members">
      <Members
        room={role}
        iconSize={14}
      />
    </div>
  </div>
)


export default Column
