// MainContent.js
import React, { Component } from 'react'
import { Nav, NavItem, NavDropdown, MenuItem, ButtonToolbar, Dropdown, Modal, Button, Input } from 'react-bootstrap'
import S from 'shorti'
import RoomsList from './RoomsList'
import MessagesList from './MessagesList'

export default class MainContent extends Component {

  showModal(modal_key) {
    this.props.showModal(modal_key)
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
    let data = this.props.data
    const path = data.path

    // Styles
    const light_weight = S('fw-100')
    const heading = { ...light_weight, ...S('mt-0') }
    const messages_list_style = {
      ...S('relative ml-40 pt-20'),
      overflow: 'scroll',
      height: window.innerHeight - 68
    }
    const rooms_list_style = {
      overflow: 'scroll',
      height: window.innerHeight - 68,
      borderRight: '1px solid #e7e4e3',
      width: '35%',
      minWidth: '300px'
    }
    const footer_style = S('absolute w-100p l-0 b-0 r-0 p-20 pb-10')

    // Dashboard default
    let main_content = (
      <div>
        <h1 style={ heading }>Hello and Welcome</h1>
        <p style={ light_weight }>This is your dashboard, enjoy doing lots of fun things here...</p>
      </div>
    )

    if(path === '/dashboard/recents'){

      main_content = (
        <div>
          <div style={ rooms_list_style } className="pull-left">
            <div style={ S('p-10 h-60 relative') }>
              <input style={ S('w-85p br-10') } type="text" placeholder="Search chats" className="form-control pull-left" />
              <div className="create-chat__btn" style={ S('w-36 h-36 ml-6 pointer absolute r-8 br-100 bg-3388ff') } >
                <img onClick={ this.showModal.bind(this,'create-chat') } src="/images/svgs/create-chat.svg"/>
              </div>
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
              <div className="clearfix"></div>
            </div>
            <RoomsList getMessages={ this.props.getMessages } data={ data }/>
          </div>
          <div style={ messages_list_style }>
            <MessagesList data={ data }/>
            <div style={ footer_style }>
              <form onSubmit={ this.props.createMessage.bind(this) }>
                <div className="form-group" style={ S('w-100p') }>
                  <input ref="message_input" type="text" className="form-control" style={ S('w-100p pl-70') } placeholder="Type your message and press enter"/>
                  <button type="button" className="btn btn-default create-message__btn" style={ S('absolute p-0 w-56 h-38 l-20 t-20') }>
                    <span className="plus" style={ S('font-22 relative t-1n color-ccc') }>+</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )
    }

    if(path === '/dashboard/mls'){
      main_content = (
        <div>
          <h1 style={ heading }>MLS</h1>
          <p style={ light_weight }>This is mls stuff</p>
        </div>
      )
    }

    if(path === '/dashboard/contacts'){
      main_content = (
        <div>
          <h1 style={ heading }>Contacts</h1>
          <p style={ light_weight }>This is Contacts stuff</p>
        </div>
      )
    }

    if(path === '/dashboard/tasks'){
      main_content = (
        <div>
          <h1 style={ heading }>Tasks</h1>
          <p style={ light_weight }>This is tasks stuff</p>
        </div>
      )
    }

    if(path === '/dashboard/transactions'){
      main_content = (
        <div>
          <h1 style={ heading }>Transactions</h1>
          <p style={ light_weight }>This is transactions stuff</p>
        </div>
      )
    }
    return main_content;
  }
}