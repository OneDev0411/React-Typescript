import React, { Component } from 'react';
import S from 'shorti';
import { Navbar, NavItem, Nav, Button } from 'react-bootstrap';
import './eager-seller.scss'

class EagerSeller extends Component {
  render() {
    return (
      <div style={ S('absolute w-100p h-100p') }>
        <Navbar style={ S('br-0 border-none') }>
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
          <div style={ S(`bg-url(/templates/eager-seller/images/agent.png)`) }></div>
        </main>
      </div>
    );
  }
}

export default EagerSeller;
