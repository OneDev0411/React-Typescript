import React from 'react'
import { Col, Button } from 'react-bootstrap'

const Column = ({ role }) => (
  <div className="column">
    <div className='title'>
      {role.title}
    </div>
    <div className="members">
      <Button
         className="addMember"
        onClick={() => this.openDialog() }
      >
        Add Member
      </Button>

    </div>
  </div>
)


export default Column
