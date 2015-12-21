// Dashboard/Transactions/index.js
import React, { Component } from 'react'
import { Link } from 'react-router'
import { Button } from 'react-bootstrap'
import S from 'shorti'
import config from '../../../../../config/public'

// Partials
import MainNav from '../Partials/MainNav'
import SideBar from '../Partials/SideBar'

export default class Transactions extends Component {

  render(){

    // Data
    const data = this.props.data
    const path = data.path

    // Style
    const main_style = S('absolute l-222 r-0')
    
    let main_content = (
      <div style={ S('ml-20') }>
        <h1>Transactions</h1>
        <Link className="btn btn-primary" to="/dashboard/transactions/new">New Transaction</Link>
        <p>This is transactions stuff</p>
      </div>
    )
    
    if(path === '/dashboard/transactions/new')
      main_content = (
        <div style={ S('ml-20') }>
          <h1>Keep 'em coming.  So are we!</h1>
          <div>
            <Link className="btn btn-primary" to="/dashboard/transactions/new">Buying</Link>
            <Link style={ S('ml-20') } className="btn btn-primary" to="/dashboard/transactions/new">Selling</Link>
            <Link style={ S('ml-20') } className="btn btn-primary" to="/dashboard/transactions/new">Buying & Selling</Link>
            <Link style={ S('ml-20') } className="btn btn-primary" to="/dashboard/transactions/new">Lease</Link>
          </div>
        </div>
      )
    
    return (
      <div style={ S('minw-1000') }>
        <header>
          <MainNav data={ data }/>
        </header>
        <main>
          <SideBar data={ data }/>
          <div style={ main_style }>
            { main_content }
          </div>
        </main>
      </div>
    )
  }
}

// PropTypes
Transactions.proptypes = {
  data: React.PropTypes.object.isRequired
}