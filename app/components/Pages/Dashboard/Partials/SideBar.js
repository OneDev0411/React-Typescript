// Dashboard.js
import React, { Component } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Nav, NavItem } from 'react-bootstrap'
import S from 'shorti'

export default class SideBar extends Component {
  render(){
    
    const sidebar_style = S('w-250 fixed h-100p p-20 pt-0')
    const data = this.props.data
    const path = data.path

    let active_key
    if(path === '/dashboard/recents'){
      active_key = 1
    }
    if(path === '/dashboard/mls'){
      active_key = 2
    }
    if(path === '/dashboard/contacts'){
      active_key = 3
    }
    if(path === '/dashboard/tasks'){
      active_key = 4
    }
    if(path === '/dashboard/transactions'){
      active_key = 5
    }

    return (
      <aside style={ sidebar_style } className="bg-alabaster">
        <Nav bsStyle="pills" stacked activeKey={ active_key }>
          <LinkContainer to="/dashboard/recents">
            <NavItem eventKey={1}>Recents</NavItem>
          </LinkContainer>
          <LinkContainer to="/dashboard/mls">
            <NavItem eventKey={2}>MLS</NavItem>
          </LinkContainer>
          <LinkContainer to="/dashboard/contacts">
            <NavItem eventKey={3}>Contacts</NavItem>
          </LinkContainer>
          <LinkContainer to="/dashboard/tasks">
            <NavItem eventKey={4}>Tasks</NavItem>
          </LinkContainer>
          <LinkContainer to="/dashboard/transactions">
            <NavItem eventKey={5}>Transactions</NavItem>
          </LinkContainer>
        </Nav>
        <h6 style={ S('mt-20') }>Favorites</h6>
        <Nav stacked>
          <NavItem>Fave 1</NavItem>
          <NavItem title="Item">Fave 2</NavItem>
        </Nav>
      </aside>
    )
  }
}