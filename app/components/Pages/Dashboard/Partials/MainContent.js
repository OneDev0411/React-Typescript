// Dashboard.js
import React, { Component } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Nav, NavItem } from 'react-bootstrap'
import S from 'shorti'
import Loading from '../../../Partials/Loading'

export default class MainContent extends Component {
  
  render(){

    // Data
    let data = this.props.data
    const path = data.path

    // Styles
    const lightWeight = S('fw-100')
    const heading = { ...lightWeight, ...S('mt-0') }

    // Dashboard default
    let main_content = (
      <div>
        <h1 style={ heading }>Hello and Welcome</h1>
        <p style={ lightWeight }>This is your dashboard, enjoy doing lots of fun things here...</p>
      </div>
    )

    if(path === '/dashboard/recents'){

      let rooms_list = <Loading />

      if(data.rooms){
        let rooms = data.rooms
        rooms_list = rooms.map((room)=>{
          return (
            <li key={ room.id }>
              { room.title }
            </li>
          )
        })
      }

      main_content = (
        <div>
          <h1 style={ heading }>Recents</h1>
          { rooms_list }
        </div>
      )
    }

    if(path === '/dashboard/mls'){
      main_content = (
        <div>
          <h1 style={ heading }>MLS</h1>
          <p style={ lightWeight }>This is mls stuff</p>
        </div>
      )
    }

    if(path === '/dashboard/contacts'){
      main_content = (
        <div>
          <h1 style={ heading }>Contacts</h1>
          <p style={ lightWeight }>This is Contacts stuff</p>
        </div>
      )
    }

    if(path === '/dashboard/tasks'){
      main_content = (
        <div>
          <h1 style={ heading }>Tasks</h1>
          <p style={ lightWeight }>This is tasks stuff</p>
        </div>
      )
    }

    if(path === '/dashboard/transactions'){
      main_content = (
        <div>
          <h1 style={ heading }>Transactions</h1>
          <p style={ lightWeight }>This is transactions stuff</p>
        </div>
      )
    }
    return main_content;
  }
}