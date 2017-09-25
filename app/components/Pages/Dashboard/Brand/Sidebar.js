import React from 'react'
import { Nav, NavItem } from 'react-bootstrap'

const Sidebar = () => (
  <div className="menu">
    <div className="toolbar">
      brand-settings
    </div>
    <Nav stacked>
      <NavItem className="item" eventKey="Checklists">
        Checklists
      </NavItem>
    </Nav>
  </div>
)

export default Sidebar