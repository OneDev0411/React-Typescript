// Dashboard/Index.js
import React, { Component } from 'react'
import { Link } from 'react-router'
import { LinkContainer } from 'react-router-bootstrap'
import { Nav, NavItem } from 'react-bootstrap'
import S from 'shorti'

// AppDispatcher
import AppDispatcher from '../../../dispatcher/AppDispatcher'

// AppStore
import AppStore from '../../../stores/AppStore'

// Partials
import MainContent from './Partials/MainContent'
import MainNav from './Partials/MainNav'
import SideBar from './Partials/SideBar'

export default class Dashboard extends Component {

  init(){
    
    const data = this.props.data
    const user = data.user
    
    AppDispatcher.dispatch({
      action: 'add-user-to-store',
      user: user
    })

    AppDispatcher.dispatch({
      action: 'get-rooms',
      user: user
    })
  }

  componentWillMount(){
    this.init()
  }

  showModal(modal_key){
    AppDispatcher.dispatch({
      action: 'show-modal',
      modal_key: modal_key
    })
  }

  hideModal(){
    AppStore.data.showCreateChatModal = false
    AppStore.emitChange()
  }

  createRoom(title){
    AppDispatcher.dispatch({
      action: 'create-room',
      title: title
    }) 
  }

  render(){

    // Data
    let data = this.props.data
    data.rooms = AppStore.data.rooms
    data.showCreateChatModal = AppStore.data.showCreateChatModal

    if(this.props.route.path){
      data.path = this.props.route.path
    } else {
      data.path = '/dashboard'
    }

    const footerStyle = S('fixed b-0 l-250 r-0 p-20')

    return (
      <div>
        <header>
          <MainNav showModal={ this.showModal } hideModal={ this.hideModal } createRoom={ this.createRoom } data={ data }/>
        </header>
        <SideBar data={ data }/>
        <main style={ S('fw-100 l-250 absolute r-0 p-20') }>
          <MainContent data={ data }/>
        </main>
        <footer style={ footerStyle }>
          <form>
            <div className="form-group" style={ S('w-100p') }>
              <input type="text" className="form-control" style={ S('w-100p pl-50') } />
              <button type="button" className="btn btn-default" style={ S('absolute l-20 t-20') }>
                <i className="fa fa-plus" style={ S('t-2 relative') }></i>
              </button>
            </div>
          </form>
        </footer>
      </div>
    )
  }
}