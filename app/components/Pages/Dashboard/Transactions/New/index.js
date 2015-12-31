// Dashboard/Transactions/New/index.js
import React, { Component } from 'react'
import { Link } from 'react-router'
import { Button, Breadcrumb, BreadcrumbItem } from 'react-bootstrap'
import S from 'shorti'

// AppStore
import AppStore from '../../../../../stores/AppStore'

// AppDispatcher
import AppDispatcher from '../../../../../dispatcher/AppDispatcher'

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
    AppStore.data.contacts_added = null
    AppStore.emitChange()
  }

  componentDidUpdate() {
    if (AppStore.data.new_transaction && AppStore.data.new_transaction.redirect_to) {
      const redirect_to = AppStore.data.new_transaction.redirect_to
      this.props.history.pushState(null, redirect_to)
    }
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

  // Set list item active
  setContactActive(index) {
    AppStore.data.active_contact = index
    AppStore.emitChange()
  }

  setListingActive(index) {
    AppStore.data.new_transaction.active_listing = index
    AppStore.emitChange()
  }

  hideContactsForm() {
    AppStore.data.filtered_contacts = null
    AppStore.emitChange()
  }

  addContact(contact, module_type) {
    AppDispatcher.dispatch({
      action: 'add-contact',
      contact,
      module_type
    })
    AppStore.data.new_transaction.contacts_added = AppStore.data.contacts_added
    AppStore.emitChange()
  }

  removeContact(contact_id, module_type) {
    AppDispatcher.dispatch({
      action: 'remove-contact',
      contact_id,
      module_type
    })
    AppStore.data.new_transaction.contacts_added = AppStore.data.contacts_added
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

  // Listings
  searchListings(q) {
    delete AppStore.data.new_transaction.listing_added
    AppStore.data.new_transaction.listing_searching = true
    AppStore.emitChange()
    const user = AppStore.data.user
    AppDispatcher.dispatch({
      action: 'search-listing',
      user,
      q
    })
  }

  addListing(listing) {
    AppStore.data.new_transaction.listing_added = listing
    AppStore.emitChange()
  }

  calculateFinancials(price, contract_price, agent_commission, co_agent_commission) {
    const data = this.props.data
    const new_transaction = data.new_transaction
    let listing_added = new_transaction.listing_added
    if (!listing_added)
      listing_added = {}
    listing_added.price = parseInt(price, 10)
    listing_added.contract_price = parseInt(contract_price, 10)
    listing_added.agent_commission = agent_commission
    listing_added.co_agent_commission = co_agent_commission
    AppStore.data.new_transaction.listing_added = listing_added
    AppStore.emitChange()
  }

  createTransaction() {
    AppStore.data.new_transaction.saving = true
    AppStore.emitChange()
    const new_transaction = this.props.data.new_transaction
    const user = AppStore.data.user
    TransactionDispatcher.dispatch({
      action: 'create',
      user,
      new_transaction
    })
  }

  selectDay(date_type, day) {
    if (!AppStore.data.new_transaction.selected_day)
      AppStore.data.new_transaction.selected_day = {}
    AppStore.data.new_transaction.selected_day[date_type] = day
    AppStore.emitChange()
  }

  render() {
    // Data
    const data = this.props.data

    // Set contacts
    data.contacts = AppStore.data.contacts

    // New transaction data
    let new_transaction
    if (data.new_transaction)
      new_transaction = data.new_transaction

    let buying_class = 'btn'
    let selling_class = 'btn'
    let buysell_class = 'btn'
    let lease_class = 'btn'

    if (new_transaction && new_transaction.type === 'Buyer')
      buying_class = 'btn btn-primary'

    if (new_transaction && new_transaction.type === 'Seller')
      selling_class = 'btn btn-primary'

    if (new_transaction && new_transaction.type === 'Buyer/Seller')
      buysell_class = 'btn btn-primary'

    if (new_transaction && new_transaction.type === 'Lease')
      lease_class = 'btn btn-primary'

    let main_content = (
      <div>
        <h1>Keep'em comin!  So are we...</h1>
        <div>
          <Button onClick={ this.handleTypeClick.bind(this, 'Buyer') } className={ buying_class }>Buying</Button>
          <Button onClick={ this.handleTypeClick.bind(this, 'Seller') } style={ S('ml-40') } className={ selling_class }>Selling</Button>
          <Button onClick={ this.handleTypeClick.bind(this, 'Buyer/Seller') } style={ S('ml-40') } className={ buysell_class }>Buying & Selling</Button>
          <Button onClick={ this.handleTypeClick.bind(this, 'Lease') } style={ S('ml-40') } className={ lease_class }>Leasing</Button>
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
            <AddListing
              data={ data }
              searchListings={ this.searchListings }
              setListingActive={ this.setListingActive }
              addListing={ this.addListing }
            />
          )
          break
        case 4:
          main_content = (
            <AddFinancials
              data={ data }
              calculateFinancials={ this.calculateFinancials.bind(this) }
            />
          )
          break
        case 5:
          main_content = (
            <AddDates
              data={ data }
              selectDay={ this.selectDay }
            />
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
          <Link className="btn btn-danger pull-left" style={ S('mr-20') } to="/dashboard/transactions">Cancel</Link>
        )
      }

      // Back Button
      if (step) {
        previous_button = (
          <Button bsStyle="link" style={ S('mr-20') } onClick={ this.handlePrevNext.bind(this, 'prev') }>Back</Button>
        )
      }
      // Next Button
      if (step < new_transaction.total_steps && new_transaction.type) {
        next_button = (
          <Button onClick={ this.handlePrevNext.bind(this, 'next') }>Next</Button>
        )
      }

      nav_buttons = (
        <div style={ S('absolute r-0 t-500') }>
          { cancel_button }
          { previous_button }
          { next_button }
        </div>
      )
    }

    // Style
    const main_style = S('absolute l-222 r-0 ml-20 w-960 h-300')

    let save_button
    if (new_transaction && new_transaction.type) {
      save_button = (
        <Button onClick={ this.createTransaction.bind(this) } style={ S('absolute r-0 t-20') } className={ new_transaction && new_transaction.saving ? ' disabled' : '' } type="button" bsStyle="primary">
          { new_transaction && new_transaction.saving ? 'Saving...' : 'Save and Quit' }
        </Button>
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
            <div style={ S('absolute w-100p') }>
              { save_button }
            </div>
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
  data: React.PropTypes.object,
  history: React.PropTypes.object
}