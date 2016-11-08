import React, { Component } from 'react'
import S from 'shorti'
import { Navbar, NavItem, Nav, Button } from 'react-bootstrap'
import default_agent_image from './images/agent.png'
import SideBar from '../../Partials/SideBar'
class EagerSeller extends Component {
  render() {
    return (
      <div style={ S('absolute w-100p h-100p color-263445') }>
        <div className="main-template" style={ S(`w-${window.innerWidth - 400} absolute l-0`) }>
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
            <section>
              <div style={ S(`bg-url(${default_agent_image}) bg-cover bg-center h-700 mb-40`) }></div>
            </section>
            <section>
              <div className="container text-center">
                <div style={ S('font-40 mb-20') }>Nora Hortan</div>
                <div style={ S('font-14 mb-20') }>
                  MLS#: 0142356&nbsp;&nbsp;|&nbsp;&nbsp;
                  linne@claystapp.com&nbsp;&nbsp;|&nbsp;&nbsp;
                  805.698.6694
                </div>
              </div>
            </section>
          </main>
        </div>
        <SideBar />
      </div>
    )
  }
}

export default EagerSeller
