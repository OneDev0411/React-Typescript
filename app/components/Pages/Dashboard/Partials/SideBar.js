// Dashboard.js
import React, { Component } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Nav, NavItem } from 'react-bootstrap'
import S from 'shorti'

export default class SideBar extends Component {
  render() {
    const data = this.props.data
    const sidebar_height = window.innerHeight - 58
    const sidebar_style = S('w-222 relative p-20 pl-0 pt-20 h-' + sidebar_height)
    const path = data.path

    const active = {}
    if (path === '/dashboard/recents')
      active.recents = 'active'

    if (path === '/dashboard/mls')
      active.mls = 'active'

    if (path === '/dashboard/contacts')
      active.contacts = 'active'

    if (path === '/dashboard/tasks')
      active.tasks = 'active'

    if (path === '/dashboard/transactions' || path === '/dashboard/transactions/new')
      active.transactions = 'active'

    return (
      <aside style={ sidebar_style } className="bg-alabaster sidebar--dashboard pull-left">
        <Nav bsStyle="pills" stacked>
          <LinkContainer className={ active.recents } to="/dashboard/recents">
            <NavItem style={ S('w-70p') }>
              <img src={ active.recents ? '/images/dashboard/icons/recents-active.svg' : '/images/dashboard/icons/recents.svg' } style={ S('w-20 h-20') }/>
              &nbsp;&nbsp;&nbsp;Recents
            </NavItem>
          </LinkContainer>
          <LinkContainer className={ active.mls } to="/dashboard/mls">
            <NavItem style={ S('w-70p') }>
              <img src={ active.mls ? '/images/dashboard/icons/listings-active.svg' : '/images/dashboard/icons/listings.svg' } style={ S('w-20 h-20') }/>
              &nbsp;&nbsp;&nbsp;MLS
            </NavItem>
          </LinkContainer>
          <LinkContainer className={ active.contacts } to="/dashboard/contacts">
            <NavItem style={ S('w-70p') }>
              <img src={ active.contacts ? '/images/dashboard/icons/contacts-active.svg' : '/images/dashboard/icons/contacts.svg' } style={ S('w-20 h-20') }/>
              &nbsp;&nbsp;&nbsp;Contacts
            </NavItem>
          </LinkContainer>
          <LinkContainer className={ active.tasks } to="/dashboard/tasks">
            <NavItem style={ S('w-70p') }>
              <img src={ active.tasks ? '/images/dashboard/icons/tasks-active.svg' : '/images/dashboard/icons/tasks.svg' } style={ S('w-20 h-20') }/>
              &nbsp;&nbsp;&nbsp;Tasks
            </NavItem>
          </LinkContainer>
          <LinkContainer className={ active.transactions } to="/dashboard/transactions">
            <NavItem style={ S('w-70p') }>
              <img src={ active.transactions ? '/images/dashboard/icons/transactions-active.svg' : '/images/dashboard/icons/transactions.svg' } style={ S('w-20 h-20') }/>
              &nbsp;&nbsp;&nbsp;Transactions
            </NavItem>
          </LinkContainer>
        </Nav>
      </aside>
    )
  }
}

// PropTypes
SideBar.propTypes = {
  data: React.PropTypes.object
}