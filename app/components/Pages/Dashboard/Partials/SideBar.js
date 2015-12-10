// Dashboard.js
import React, { Component } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Nav, NavItem } from 'react-bootstrap'
import S from 'shorti'

export default class SideBar extends Component {
  render(){
    
    const data = this.props.data
    const sidebar_height = window.innerHeight - 68
    const sidebar_style = S('w-222 absolute t-68 p-20 pl-0 pt-30 h-' + sidebar_height)
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
      <aside style={ sidebar_style } className="bg-alabaster sidebar--dashboard">
        <Nav bsStyle="pills" stacked activeKey={ active_key }>
          <LinkContainer to="/dashboard/recents">
            <NavItem style={ S('w-70p') } eventKey={1}>Recents</NavItem>
          </LinkContainer>
          <LinkContainer to="/dashboard/mls">
            <NavItem style={ S('w-70p') } eventKey={2}>MLS</NavItem>
          </LinkContainer>
          <LinkContainer to="/dashboard/contacts">
            <NavItem style={ S('w-70p') } eventKey={3}>Contacts</NavItem>
          </LinkContainer>
          <LinkContainer to="/dashboard/tasks">
            <NavItem style={ S('w-70p') } eventKey={4}>Tasks</NavItem>
          </LinkContainer>
          <LinkContainer to="/dashboard/transactions">
            <NavItem style={ S('w-70p') } eventKey={5}>Transactions</NavItem>
          </LinkContainer>
        </Nav>
      </aside>
    )
  }
}