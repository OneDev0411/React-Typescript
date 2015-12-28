
// Dashboard/Transactions/index.js
import React, { Component } from 'react'
import { Link } from 'react-router'
import { Table } from 'react-bootstrap'
import S from 'shorti'

// Partials
import MainNav from '../Partials/MainNav'
import SideBar from '../Partials/SideBar'

// AppDispatcher
import AppDispatcher from '../../../../dispatcher/AppDispatcher'

export default class Transactions extends Component {

  componentDidMount() {
    this.getContacts()
  }

  getContacts() {
    const data = this.props.data
    AppDispatcher.dispatch({
      action: 'get-contacts',
      user: data.user
    })
  }

  render() {
    // Data
    const data = this.props.data

    // Style
    const main_style = S('absolute l-222 r-0 pl-20 pr-20')

    const main_content = (
      <div>
        <div>
          <h1>
            Transactions
            <Link className="btn btn-primary pull-right" to="/dashboard/transactions/new">+ New Transaction</Link>
          </h1>
        </div>
        <div>
          <Table striped bordered condensed hover>
            <thead>
              <tr>
                <th>Property</th>
                <th>Contact</th>
                <th>Price</th>
                <th>Next Task</th>
                <th>Closing Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Image</td>
                <td>Name</td>
                <td>$1,000,000</td>
                <td>Tax Document</td>
                <td>Wed, 12th, Jan 2016</td>
              </tr>
              <tr>
                <td>Image</td>
                <td>Name</td>
                <td>$1,000,000</td>
                <td>Tax Document</td>
                <td>Wed, 12th, Jan 2016</td>
              </tr>
              <tr>
                <td>Image</td>
                <td>Name</td>
                <td>$1,000,000</td>
                <td>Tax Document</td>
                <td>Wed, 12th, Jan 2016</td>
              </tr>
            </tbody>
          </Table>
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
Transactions.propTypes = {
  data: React.PropTypes.object
}