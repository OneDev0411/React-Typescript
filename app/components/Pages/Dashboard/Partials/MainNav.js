// MainNav.js
import React, { Component } from 'react'
import { Link } from 'react-router'
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap'
import S from 'shorti'
import ProfileImage from './ProfileImage'

export default class MainNav extends Component {

  render(){
    
    // Data
    const data = this.props.data
    const first_name = data.user.first_name
    const last_name = data.user.last_name
    let profile_image_url = data.user.profile_image_url

    // Style
    const nav_bar_style = { ...S('mb-0 p-0 h-58 pt-3'), borderBottom: '1px solid #e7e4e3' }
    
    return (
      <Navbar style={ nav_bar_style } fluid>
        <Nav>
          <div style={ S('absolute pt-7 pl-8 z-0') }>
            <ProfileImage data={ data } profile_image_url={ profile_image_url } />
          </div>
          <NavDropdown className="main-nav-dropdown--account" style={ S('ml39n') } eventKey={3} title={ first_name + ' ' + last_name }>
            <li><Link to="/account/settings"><i className="fa fa-cog" style={ S('mr-15') }></i>Settings</Link></li>
            <li><Link to="/account/notifications"><i className="fa fa-envelope" style={ S('mr-15') }></i>Notifications</Link></li>
            <li role="separator" className="divider"></li>
            <li><a href="/signout"><i className="fa fa-power-off" style={ S('mr-15') }></i>Sign out</a></li>
          </NavDropdown>
        </Nav>
      </Navbar>
    )
  }
}

/*
<nav style={ nav_bar_style } className="navbar main-navbar bg-alabaster">
  <div className="container-fluid">
    <ul style={ S('ml-20n') } className="nav navbar-nav navbar-left">
      <li className="dropdown">
        <div style={ S('absolute pt-7 pl-7') }>
          <ProfileImage data={ data } profile_image_url={ profile_image_url } />
        </div>
        <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false" style={ S('font-12 pl-55 z-1 color-333')}>
          { first_name } { last_name } <span style={ S('color-c3c3c3') } className="caret"></span>
        </a>
        <ul className="dropdown-menu">
          <li><Link to="/account/settings"><i className="fa fa-cog" style={ S('mr-15') }></i>Settings</Link></li>
          <li><Link to="/account/notifications"><i className="fa fa-envelope" style={ S('mr-15') }></i>Notifications</Link></li>
          <li role="separator" className="divider"></li>
          <li><a href="/signout"><i className="fa fa-power-off" style={ S('mr-15') }></i>Sign out</a></li>
        </ul>
      </li>
    </ul>
  </div>
</nav>
*/