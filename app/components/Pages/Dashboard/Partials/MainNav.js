// MainNav.js
import React, { Component } from 'react'
import { Link } from 'react-router'
import { Nav, NavItem, NavDropdown, MenuItem, ButtonToolbar, Dropdown, Modal, Button, Input } from 'react-bootstrap'
import S from 'shorti'
import ProfileImage from './ProfileImage'

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

  showModal(eventKey, href) {
    this.props.showModal(href)
    setTimeout(() => {
      if(this.refs.title)
        this.refs.title.getInputDOMNode().focus()
    }, 300)
  }

  handleSubmit(e){
    e.preventDefault()
    let title = this.refs.title.getInputDOMNode().value
    title = title.trim()
    if(title)
      this.props.createRoom(title)
  }

  hideModal(e){
    this.props.hideModal()
  }

  render(){
    
    // Data
    const data = this.props.data
    const first_name = data.user.first_name
    const last_name = data.user.last_name
    let profile_image_url = data.user.profile_image_url

    // Style
    const nav_bar_style = S('mb-0 p-15')
    
    return (
      <nav style={ nav_bar_style } className="navbar bg-alabaster">
        <div className="container-fluid">
          <ul className="nav navbar-nav navbar-left">
            <li className="dropdown">
              <ProfileImage data={ data } profile_image_url={ profile_image_url } />
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
            </li>
            <li>
              <ButtonToolbar>
                <Dropdown id="dropdown-custom-1">
                  <Dropdown.Toggle noCaret>
                    <i className="fa fa-plus"></i>
                  </Dropdown.Toggle>
                  <Dropdown.Menu onSelect={ this.showModal.bind(this) }>
                    <MenuItem eventKey="create-chat">Start a New Chat</MenuItem>
                    <MenuItem eventKey="add-contact">Add Contact</MenuItem>
                    <MenuItem eventKey="add-alert">Add an Alert</MenuItem>
                  </Dropdown.Menu>
                </Dropdown>
              </ButtonToolbar>
              <Modal show={ data.showCreateChatModal } onHide={ this.hideModal.bind(this) }>
                <form onSubmit={ this.handleSubmit.bind(this) }>
                  <Modal.Header closeButton>
                    <Modal.Title>Start a new chat</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Input type="text" ref="title" placeholder="Chat room title"/>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button onClick={ this.hideModal.bind(this) }>Cancel</Button>
                    <Button type="submit" bsStyle="primary">Start chat</Button>
                  </Modal.Footer>
                </form>
              </Modal>
            </li>
          </ul>
        </div>
      </nav>
    )
  }
}