// Dashboard/Transactions/New/index.js
import React, { Component } from 'react'
import { Link } from 'react-router'
import { Button, Breadcrumb, BreadcrumbItem } from 'react-bootstrap'
import _ from 'lodash'
import S from 'shorti'

// AppStore
import AppStore from '../../../../../stores/AppStore'

// AppDispatcher
import AppDispatcher from '../../../../../dispatcher/TransactionDispatcher'

// TransactionDispatcher
import TransactionDispatcher from '../../../../../dispatcher/TransactionDispatcher'

// Partials
import MainNav from '../../Partials/MainNav'
import SideBar from '../../Partials/SideBar'

// Steps
import AddClients from './Steps/AddClients'
import AddContacts from './Steps/AddContacts'
import AddListing from './Steps/AddListing'
import AddFinancials from './Steps/AddFinancials'
import AddDates from './Steps/AddDates'

export default class NewTransaction extends Component {

  componentDidMount() {
    TransactionDispatcher.dispatch({
      action: 'init'
    })
    this.getContacts()
    AppStore.data.active_contact = -1
    AppStore.data.added_contacts = null
    AppStore.emitChange()
  }

  getBreadCrumbs(step) {
    let type_active = false
    let contacts_active = false
    let entries_active = false
    let listing_active = false
    let financials_active = false
    let dates_active = false
    if (step === 0)
      type_active = true
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
      <BreadcrumbItem key={ 'breadcrumb-1' } onClick={ this.handleGoToStep.bind(this, 0) } active={ type_active }>Type</BreadcrumbItem>,
      <BreadcrumbItem key={ 'breadcrumb-2' } onClick={ this.handleGoToStep.bind(this, 1) } active={ contacts_active }>Clients</BreadcrumbItem>,
      <BreadcrumbItem key={ 'breadcrumb-3' } onClick={ this.handleGoToStep.bind(this, 2) } active={ entries_active }>Other contacts</BreadcrumbItem>,
      <BreadcrumbItem key={ 'breadcrumb-4' } onClick={ this.handleGoToStep.bind(this, 3) } active={ listing_active }>Listing</BreadcrumbItem>,
      <BreadcrumbItem key={ 'breadcrumb-5' } onClick={ this.handleGoToStep.bind(this, 4) } active={ financials_active }>Financials</BreadcrumbItem>,
      <BreadcrumbItem key={ 'breadcrumb-6' } onClick={ this.handleGoToStep.bind(this, 5) } active={ dates_active }>Important dates</BreadcrumbItem>
    ]
    return breadcrumb_items.filter((item, i) => {
      return i <= step
    })
  }

  getContacts() {
    const data = this.props.data
    AppDispatcher.dispatch({
      action: 'get-contacts',
      user: data.user
    })
  }

  setFilteredContacts(filtered_contacts) {
    AppStore.data.filtered_contacts = filtered_contacts
    AppStore.emitChange()
  }

  setContactActive(index) {
    AppStore.data.active_contact = index
    AppStore.emitChange()
  }

  hideContactsForm() {
    AppStore.data.filtered_contacts = null
    AppStore.emitChange()
  }

  addContact(contact, contact_type) {
    if (!AppStore.data.added_contacts) {
      AppStore.data.added_contacts = {}
      AppStore.data.added_contacts[contact_type] = []
    } else {
      if (!AppStore.data.added_contacts[contact_type])
        AppStore.data.added_contacts[contact_type] = []
    }
    const added_contacts = AppStore.data.added_contacts[contact_type]
    const filtered_contacts = AppStore.data.filtered_contacts
    const in_array = _.findWhere(added_contacts, { id: contact.id })
    const contact_index = _.findIndex(filtered_contacts, { id: contact.id })
    contact.added = true
    if (!in_array) {
      AppStore.data.filtered_contacts[contact_index] = contact
      AppStore.data.added_contacts[contact_type].push(contact)
      AppStore.data.new_transaction.added_contacts = AppStore.data.added_contacts
      AppStore.emitChange()
    } else
      this.removeContact(contact.id, contact_type)
  }

  removeContact(contact_id, contact_type) {
    const added_contacts = AppStore.data.added_contacts[contact_type]
    const filtered_contacts = AppStore.data.filtered_contacts
    if (filtered_contacts) {
      const contact = _.findWhere(added_contacts, { id: contact_id })
      const contact_index = _.findIndex(filtered_contacts, { id: contact_id })
      contact.added = false
      AppStore.data.filtered_contacts[contact_index] = contact
    }
    const added_contacts_edited = added_contacts.filter((contact_loop) => {
      return contact_loop.id !== contact_id
    })
    AppStore.data.added_contacts[contact_type] = added_contacts_edited
    AppStore.data.new_transaction.added_contacts = AppStore.data.added_contacts
    AppStore.emitChange()
  }

  showCreateContactModal() {
    AppStore.data.show_create_contact_modal = true
    AppStore.emitChange()
  }

  hideModal() {
    delete AppStore.data.show_create_contact_modal
    AppStore.emitChange()
  }

  createContact() {
    // console.log('create')
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
    AppStore.data.filtered_contacts = null
    AppStore.data.active_contact = null
    AppStore.emitChange()
  }

  handleGoToStep(step) {
    // Data
    TransactionDispatcher.dispatch({
      action: 'go-to-step',
      step
    })
    AppStore.data.filtered_contacts = null
    AppStore.data.active_contact = null
    AppStore.emitChange()
  }

  render() {
    // Data
    const data = this.props.data
    const main_style = S('absolute l-222 r-0 ml-20 w-960 h-300')
    // New transaction data
    let new_transaction
    if (data.new_transaction)
      new_transaction = data.new_transaction

    let buying_class = 'btn'
    let selling_class = 'btn'
    let buysell_class = 'btn'
    let lease_class = 'btn'

    if (new_transaction && new_transaction.type === 'buying')
      buying_class = 'btn btn-primary'

    if (new_transaction && new_transaction.type === 'selling')
      selling_class = 'btn btn-primary'

    if (new_transaction && new_transaction.type === 'buying-selling')
      buysell_class = 'btn btn-primary'

    if (new_transaction && new_transaction.type === 'leasing')
      lease_class = 'btn btn-primary'

    let main_content = (
      <div>
        <h1>Keep'em comin!  So are we...</h1>
        <div>
          <Button onClick={ this.handleTypeClick.bind(this, 'buying') } className={ buying_class }>Buying</Button>
          <Button onClick={ this.handleTypeClick.bind(this, 'selling') } style={ S('ml-40') } className={ selling_class }>Selling</Button>
          <Button onClick={ this.handleTypeClick.bind(this, 'buying-selling') } style={ S('ml-40') } className={ buysell_class }>Buying & Selling</Button>
          <Button onClick={ this.handleTypeClick.bind(this, 'leasing') } style={ S('ml-40') } className={ lease_class }>Leasing</Button>
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
            <AddClients
              data={ data }
              setFilteredContacts={ this.setFilteredContacts.bind(this) }
              setContactActive={ this.setContactActive.bind(this) }
              hideContactsForm={ this.hideContactsForm }
              addContact={ this.addContact }
              removeContact={ this.removeContact }
              showCreateContactModal={ this.showCreateContactModal }
              hideModal={ this.hideModal }
              createContact={ this.createContact }
            />
          )
          break
        case 2:
          main_content = (
            <AddContacts
              data={ data }
              setFilteredContacts={ this.setFilteredContacts.bind(this) }
              setContactActive={ this.setContactActive.bind(this) }
              hideContactsForm={ this.hideContactsForm }
              addContact={ this.addContact }
              removeContact={ this.removeContact }
              showCreateContactModal={ this.showCreateContactModal }
              hideModal={ this.hideModal }
              createContact={ this.createContact }
            />
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
      breadcrumbs = (
        <Breadcrumb style={ S('mt-20') }>
          { this.getBreadCrumbs(step) }
        </Breadcrumb>
      )

      // Buttons
      let previous_button
      let next_button
      let cancel_button

      // Cancel Button
      if (!step) {
        cancel_button = (
          <Link className="btn btn-default" style={ S('mr-20') } to="/dashboard/transactions">Cancel</Link>
        )
      }

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
        <div style={ S('absolute r-0 t-400') }>
          { cancel_button }
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
            <div style={ S('absolute w-100p') }>
              { main_content }
            </div>
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