// MainNav.js
import React, { Component } from 'react'
import { Link } from 'react-router'
import { Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap'
import S from 'shorti'

export default class MainNav extends Component {

  handleFocus(e){
    const input = e.target
    input.style.width = '300px'
    input.placeholder = 'Start typing...'
  }

  handleBlur(e){
    const input = e.target
    input.style.width = '100%'
    input.placeholder = 'Search'
  }

  render(){
    
    // Data
    const data = this.props.data
    const navBarStyle = S('mb-0 p-15')
    
    let first_name = data.user.first_name
    let last_name = data.user.last_name

    return (
      <nav style={ navBarStyle } className="navbar bg-alabaster">
        <div className="container-fluid">
          <ul className="nav navbar-nav navbar-left">
            <li className="dropdown">
              <img className="img-circle" src="//www.gravatar.com/avatar/88953ad02006d1428416245a402d5b9d?s=70" style={ S('w-35 ml-7 mt-7 absolute z-2')} />
              <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false" style={ S('pl-55 z-1')}>
                { first_name } { last_name } <span className="caret"></span>
              </a>
              <ul className="dropdown-menu">
                <li><Link to="/account/settings"><i className="fa fa-cog" style={ S('mr-15') }></i>Settings</Link></li>
                <li><Link to="/account/notifications"><i className="fa fa-envelope" style={ S('mr-15') }></i>Notifications</Link></li>
                <li role="separator" className="divider"></li>
                <li><a href="/signout"><i className="fa fa-power-off" style={ S('mr-15') }></i>Sign out</a></li>
              </ul>
            </li>
          </ul>
          <ul className="nav navbar-nav navbar-right">
            <li>
              <input type="text" placeholder="Search" className="form-control" onFocus={ this.handleFocus } onBlur={ this.handleBlur } />
              <button type="button" className="btn btn-default" style={ S('absolute r-0 t-0') }>
                <i className="fa fa-plus" style={ S('t-2 relative') }></i>
              </button>
            </li>
          </ul>
        </div>
      </nav>
    )
  }
}