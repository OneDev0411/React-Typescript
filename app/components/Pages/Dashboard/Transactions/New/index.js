// Dashboard/Transactions/New/index.js
import React, { Component } from 'react'
import { Button, Breadcrumb, BreadcrumbItem } from 'react-bootstrap'
import S from 'shorti'

// TransactionDispatcher
import TransactionDispatcher from '../../../../../dispatcher/TransactionDispatcher'

// Partials
import MainNav from '../../Partials/MainNav'
import SideBar from '../../Partials/SideBar'

// Steps
import AddContacts from './Steps/AddContacts'
import AddEntities from './Steps/AddEntities'
import AddListing from './Steps/AddListing'
import AddFinancials from './Steps/AddFinancials'
import AddDates from './Steps/AddDates'

export default class NewTransaction extends Component {

  componentDidMount() {
    TransactionDispatcher.dispatch({
      action: 'init'
    })
  }

  getBreadCrumbs(step) {
    let contacts_active = false
    let entries_active = false
    let listing_active = false
    let financials_active = false
    let dates_active = false
    if (step === 1)
      contacts_active = true
    if (step === 2)
      entries_active = true
    if (step === 3)
      listing_active = true
    if (step === 4)
      financials_active = true
    if (step === 5)
      dates_active = true
    const breadcrumb_items = [
      <BreadcrumbItem key={ 'breadcrumb-1' } onClick={ this.handleGoToStep.bind(this, 1) } active={ contacts_active }>Add contacts</BreadcrumbItem>,
      <BreadcrumbItem key={ 'breadcrumb-2' } onClick={ this.handleGoToStep.bind(this, 2) } active={ entries_active }>Add entities</BreadcrumbItem>,
      <BreadcrumbItem key={ 'breadcrumb-3' } onClick={ this.handleGoToStep.bind(this, 3) } active={ listing_active }>Add listing</BreadcrumbItem>,
      <BreadcrumbItem key={ 'breadcrumb-4' } onClick={ this.handleGoToStep.bind(this, 4) } active={ financials_active }>Add financials</BreadcrumbItem>,
      <BreadcrumbItem key={ 'breadcrumb-5' } onClick={ this.handleGoToStep.bind(this, 5) } active={ dates_active }>Add dates</BreadcrumbItem>
    ]
    return breadcrumb_items.filter((item, i) => {
      return i < step
    })
  }

  handleTypeClick(type) {
    TransactionDispatcher.dispatch({
      action: 'set-type',
      type
    })
    this.handleGoToStep(1)
  }

  handlePrevNext(direction) {
    // Data
    const data = this.props.data
    const current_step = data.new_transaction.step
    let step
    if (direction === 'next')
      step = current_step + 1
    if (direction === 'prev')
      step = current_step - 1
    TransactionDispatcher.dispatch({
      action: 'go-to-step',
      step
    })
  }

  handleGoToStep(step) {
    // Data
    TransactionDispatcher.dispatch({
      action: 'go-to-step',
      step
    })
  }

  render() {
    // Data
    const data = this.props.data
    const main_style = S('absolute l-222 r-0 ml-20 w-960 h-300')
    // New transaction data
    let new_transaction
    if (data.new_transaction)
      new_transaction = data.new_transaction

    let main_content = (
      <div>
        <h1>Keep'em comin!  So are we...</h1>
        <div>
          <Button onClick={ this.handleTypeClick.bind(this, 'buying') } className="btn btn-primary">Buying</Button>
          <Button onClick={ this.handleTypeClick.bind(this, 'selling') } style={ S('ml-40') } className="btn btn-primary">Selling</Button>
          <Button onClick={ this.handleTypeClick.bind(this, 'buying-selling') } style={ S('ml-40') } className="btn btn-primary">Buying & Selling</Button>
          <Button onClick={ this.handleTypeClick.bind(this, 'lease') } style={ S('ml-40') } className="btn btn-primary">Lease</Button>
        </div>
      </div>
    )
    // Set vars
    let nav_buttons
    let breadcrumbs
    if (new_transaction) {
      const step = new_transaction.step
      // Main content
      switch (new_transaction.step) {
        case 1:
          main_content = (
            <AddContacts data={ data }/>
          )
          break
        case 2:
          main_content = (
            <AddEntities data={ data }/>
          )
          break
        case 3:
          main_content = (
            <AddListing data={ data }/>
          )
          break
        case 4:
          main_content = (
            <AddFinancials data={ data }/>
          )
          break
        case 5:
          main_content = (
            <AddDates data={ data }/>
          )
          break
        default:
          main_content = main_content
      }

      // Breadcrumbs
      if (step) {
        breadcrumbs = (
          <Breadcrumb style={ S('mt-20') }>
            { this.getBreadCrumbs(step) }
          </Breadcrumb>
        )
      }

      // Buttons
      let previous_button
      let next_button

      // Back Button
      if (step) {
        previous_button = (
          <Button bsStyle="link" style={ S('mr-20') } onClick={ this.handlePrevNext.bind(this, 'prev') }>Back</Button>
        )
      }
      // Next Button
      if (step < new_transaction.total_steps) {
        next_button = (
          <Button onClick={ this.handlePrevNext.bind(this, 'next') }>Next</Button>
        )
      }

      nav_buttons = (
        <div style={ S('absolute r-0 b-0') }>
          { previous_button }
          { next_button }
        </div>
      )
    }

    return (
      <div style={ S('minw-1000') }>
        <header>
          <MainNav data={ data }/>
        </header>
        <main>
          <SideBar data={ data }/>
          <div style={ main_style }>
            { breadcrumbs }
            { main_content }
            { nav_buttons }
          </div>
        </main>
      </div>
    )
  }
}

// PropTypes
NewTransaction.propTypes = {
  data: React.PropTypes.object
}