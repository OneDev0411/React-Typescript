import React, { Component } from 'react'
import S from 'shorti'
import { Navbar, NavItem, Nav, Button } from 'react-bootstrap'
import agent_image from './images/agent.png'

class EagerSeller extends Component {
  render() {
    return (
      <div style={ S('absolute w-100p h-100p') }>
        <Navbar style={ S('br-0 border-none mb-0') }>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="#">ClayStapp</a>
            </Navbar.Brand>
          </Navbar.Header>
          <Nav pullRight>
            <NavItem eventKey={1} href="#">HIGHLIGHTS</NavItem>
            <NavItem eventKey={2} href="#">ABOUT ME</NavItem>
            <NavItem eventKey={2} href="#">MY LISTINGS</NavItem>
            <NavItem eventKey={2} href="#">ABOUT ME</NavItem>
            <NavItem eventKey={2} href="#">
              <Button>Search With Me</Button>
            </NavItem>
          </Nav>
        </Navbar>
        <main>
          <div style={ S(`bg-url(${agent_image}) bg-cover bg-center h-700`) }></div>
        </main>
      </div>
    )
  }
}

export default EagerSeller
