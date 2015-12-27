// Dashboard/Transactions/index.js
import React, { Component } from 'react'
import { Link } from 'react-router'
import S from 'shorti'

// Partials
import MainNav from '../Partials/MainNav'
import SideBar from '../Partials/SideBar'

export default class Transactions extends Component {

  render() {
    // Data
    const data = this.props.data

    // Style
    const main_style = S('absolute l-222 r-0')
    const main_content = (
      <div style={ S('ml-20') }>
        <h1>Transactions</h1>
        <Link className="btn btn-primary" to="/dashboard/transactions/new">New Transaction</Link>
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
Transactions.propTypes = {
  data: React.PropTypes.object
}