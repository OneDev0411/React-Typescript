// MainContent.js
import React, { Component } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Nav, NavItem } from 'react-bootstrap'
import S from 'shorti'
import RoomsList from './RoomsList'
import MessagesList from './MessagesList'

export default class MainContent extends Component {

  render(){

    // Data
    let data = this.props.data
    const path = data.path

    // Styles
    const light_weight = S('fw-100')
    const heading = { ...light_weight, ...S('mt-0') }
    const scroll_area_style = {
      overflow: 'scroll',
      height: data.scroll_area_height
    }

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
          <div style={ scroll_area_style } className="pull-left">
            <RoomsList getMessages={ this.props.getMessages } data={ data }/>
          </div>
          <div style={ { ...scroll_area_style, ...S('ml-40 w-630') } }>
            <MessagesList data={ data }/>
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