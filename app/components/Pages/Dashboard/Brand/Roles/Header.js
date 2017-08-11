import React from 'react'
import { Button } from 'react-bootstrap'

const Header = () => (
  <div className="toolbar">
    <span className='title'>
      Assign Members to Roles
    </span>
    <span className="button">
      <Button
        bsStyle="primary"
        onClick={() => this.openDialog() }
      >
        Add New Role
      </Button>

    </span>
  </div>
)

export default Header
