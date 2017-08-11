import React from 'react'
import { Row, Button } from 'react-bootstrap'

const Header = () => (
  <Row className="toolbar">
    <div className='title'>
      Assign Members to Roles
    </div>
    <div lg={6} md={6} sm={6} className="button">
      <Button
        bsStyle="primary"
        onClick={() => this.openDialog() }
      >
        Add New Role
      </Button>

    </div>
  </Row>
)


export default Header
