// Dashboard/Transactions/index.js
import React, { Component } from 'react'
import { Table, Alert } from 'react-bootstrap'
import S from 'shorti'
import _ from 'lodash'
import validator from 'validator'

// AppStore
import AppStore from '../../../../stores/AppStore'

// AppDispatcher
import AppDispatcher from '../../../../dispatcher/AppDispatcher'

// TransactionDispatcher
import TransactionDispatcher from '../../../../dispatcher/TransactionDispatcher'

// Partials
import SideBar from '../Partials/SideBar'
import Header from '../Partials/Header'
import TransactionDetail from './Partials/TransactionDetail'
import Loading from '../../../Partials/Loading'

// Helpers
import helpers from '../../../../utils/helpers'
import listing_util from '../../../../utils/listing'

export default class Transactions extends Component {

  componentDidMount() {
    this.getContacts()
    this.getTransactions()
    // If coming from redirect
    if (AppStore.data.new_transaction && AppStore.data.new_transaction.redirect_to) {
      setTimeout(() => {
        delete AppStore.data.new_transaction.redirect_to
        delete AppStore.data.new_transaction.saved
      }, 3000)
    }
  }

  componentDidUpdate() {
    const data = this.props.data
    const path = this.props.route.path
    if (path === 'dashboard/transactions/:id' && data.transactions_loaded && !data.current_transaction && !data.current_transaction_loaded)
      this.setPageLoadedView()
  }

  setPageLoadedView() {
    const data = this.props.data
    const transactions = data.transactions
    const params = this.props.params
    const id = params.id
    const current_transaction = _.findWhere(transactions, { id })
    AppStore.data.current_transaction = current_transaction
    AppStore.data.current_transaction_loaded = true
    AppStore.emitChange()
    this.addTransactionTab(current_transaction)
  }

  getContacts() {
    const data = this.props.data
    AppDispatcher.dispatch({
      action: 'get-contacts',
      user: data.user
    })
  }

  getTransactions() {
    const data = this.props.data
    if (!data.transactions) {
      TransactionDispatcher.dispatch({
        action: 'get-all',
        user: data.user
      })
    }
  }

  setDrawerContent(key, keep_open) {
    const drawer = AppStore.data.current_transaction.drawer
    // If double click
    if (drawer && drawer.content && key === drawer.content && !keep_open)
      this.closeDrawer()
    else {
      AppStore.data.current_transaction.drawer = {
        open: true,
        content: key
      }
      AppStore.data.current_transaction.drawer_active = true
    }
    AppStore.emitChange()
  }

  closeDrawer() {
    delete AppStore.data.current_transaction.drawer_active
    AppStore.emitChange()
    setTimeout(() => {
      delete AppStore.data.current_transaction.drawer
      AppStore.emitChange()
    }, 200)
  }

  handleCloseSavedAlert() {
    delete AppStore.data.new_transaction.saved
    AppStore.emitChange()
  }

  handleClickTransaction(transaction) {
    const transaction_tabs = AppStore.data.transaction_tabs
    if (!_.findWhere(transaction_tabs, { id: transaction.id }))
      this.addTransactionTab(transaction)
    this.viewTransaction(transaction)
  }

  addTransactionTab(transaction) {
    const transaction_tabs = AppStore.data.transaction_tabs
    if (!transaction_tabs)
      AppStore.data.transaction_tabs = []
    AppStore.data.transaction_tabs.push(transaction)
    AppStore.emitChange()
  }

  viewAllTransactions() {
    delete AppStore.data.current_transaction
    history.pushState(null, null, '/dashboard/transactions')
    AppStore.emitChange()
  }

  viewTransaction(transaction) {
    const attachments = transaction.attachments
    const attachments_sorted = _.sortBy(attachments, 'created', attachment => {
      return - attachment.created
    })
    transaction.attachments = attachments_sorted
    AppStore.data.current_transaction = transaction
    history.pushState(null, null, '/dashboard/transactions/' + transaction.id)
    AppStore.emitChange()
  }

  removeTransactionTab(id) {
    // TODO Stay on current tab or go to all transaction tab (after other tab click event triggered)
    setTimeout(() => {
      const transaction_tabs = AppStore.data.transaction_tabs
      const current_transaction = AppStore.data.current_transaction
      const reduced_transaction_tabs = transaction_tabs.filter(transaction => {
        return transaction.id !== id
      })
      AppStore.data.transaction_tabs = reduced_transaction_tabs
      if (current_transaction.id === id)
        delete AppStore.data.current_transaction
      history.pushState(null, null, '/dashboard/transactions/')
      AppStore.emitChange()
    }, 1)
  }

  deleteTransaction(id) {
    const data = this.props.data
    const user = data.user
    AppStore.data.deleting_transaction = id
    AppStore.emitChange()
    TransactionDispatcher.dispatch({
      action: 'delete-transaction',
      user,
      id
    })
  }

  showDocModal(files) {
    const indexed_files = files.map((file, i) => {
      file.index = i
      return file
    })
    AppStore.data.document_modal = {
      files: indexed_files,
      current_file: files[0]
    }
    AppStore.data.show_document_modal = true
    this.setDrawerContent('docs', true)
    this.dragLeave()
    AppStore.emitChange()
  }

  handleNameChange(new_name) {
    AppStore.data.document_modal.editing_name = true
    AppStore.data.document_modal.current_file.new_name = new_name
    AppStore.emitChange()
  }

  hideModal() {
    delete AppStore.data.show_contact_modal
    delete AppStore.data.contact_modal
    delete AppStore.data.creating_contacts
    delete AppStore.data.show_document_modal
    delete AppStore.data.current_transaction.show_edit_modal
    // rekey attachments
    const files = AppStore.data.current_transaction.attachments
    if (files) {
      const indexed_files = files.map((file, i) => {
        file.index = i
        return file
      })
      AppStore.data.current_transaction.attachments = indexed_files
    }
    AppStore.emitChange()
  }

  uploadFile() {
    const data = this.props.data
    const files = data.document_modal.files
    const files_count = files.length
    const current_file = data.document_modal.current_file
    if (!AppStore.data.current_transaction.attachments)
      AppStore.data.current_transaction.attachments = []
    const transaction = data.current_transaction
    const user = data.user
    TransactionDispatcher.dispatch({
      action: 'upload-files',
      user,
      transaction,
      files: [current_file]
    })
    const attachments = data.current_transaction.attachments
    current_file.uploading = true
    AppStore.data.current_transaction.attachments = [
      current_file,
      ...attachments
    ]
    // Next file
    if (current_file.index === files_count - 1)
      this.hideModal()
    else {
      const next_file = files[current_file.index + 1]
      // this.refs.file_name.refs.input.value = next_file.name
      AppStore.data.document_modal.current_file = next_file
    }
    delete AppStore.data.document_modal.editing_name
    AppStore.emitChange()
  }

  deleteFile(file) {
    const files = AppStore.data.current_transaction.attachments
    const edited_files = files.filter(file_loop => {
      return file_loop.id !== file.id
    })
    AppStore.data.current_transaction.attachments = edited_files
    AppStore.emitChange()
  }

  addDocs(files) {
    this.showDocModal(files)
    AppStore.emitChange()
  }

  dragEnter() {
    this.setDrawerContent('docs', true)
    AppStore.data.current_transaction.drag_enter = true
    AppStore.emitChange()
  }

  dragLeave() {
    delete AppStore.data.current_transaction.drag_enter
    AppStore.emitChange()
  }

  showEditModal() {
    AppStore.data.current_transaction.show_edit_modal = true
    AppStore.emitChange()
  }

  editTransaction(e) {
    e.preventDefault()
    AppStore.data.current_transaction.editing = true
    AppStore.emitChange()
    const transaction = AppStore.data.current_transaction
    const user = AppStore.data.user
    const address = this.refs.address.value
    const status = this.refs.status.value
    const city = this.refs.city.value
    const state = this.refs.state.value
    const postal_code = this.refs.postal_code.value
    const year_built = this.refs.year_built.value
    const property_type = this.refs.property_type.value
    const square_feet = this.refs.square_feet.value
    const bedroom_count = this.refs.bedroom_count.value
    const bathroom_count = this.refs.bathroom_count.value
    const listing_data = {
      status,
      property: {
        property_type,
        year_built,
        address: {
          street_full: address,
          city,
          state,
          postal_code
        },
        square_feet,
        bedroom_count,
        bathroom_count
      }
    }
    // console.log(user, transaction, listing_data)
    TransactionDispatcher.dispatch({
      action: 'edit-transaction',
      user,
      transaction,
      listing_data
    })
  }

  openFileViewer(attachment) {
    AppStore.data.current_transaction.viewer = {
      attachment
    }
    AppStore.emitChange()
  }

  closeFileViewer() {
    delete AppStore.data.current_transaction.viewer
    const data = AppStore.data
    const transaction = data.current_transaction
    history.pushState(null, null, '/dashboard/transactions/' + transaction.id)
    AppStore.emitChange()
  }

  // Contacts
  getContacts() {
    const user = this.props.data.user
    AppDispatcher.dispatch({
      action: 'get-contacts',
      user
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

  hideContactsForm() {
    AppStore.data.filtered_contacts = null
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

  showContactModal(contact) {
    if (contact) {
      AppStore.data.contact_modal = {
        contact
      }
    }
    AppStore.data.show_contact_modal = true
    AppStore.emitChange()
  }

  showNewContentInitials(first_initial, last_initial) {
    AppStore.data.new_contact_modal = {
      first_initial,
      last_initial
    }
    AppStore.emitChange()
  }

  addContact(module_type, e) {
    e.preventDefault()
    AppStore.data.creating_contacts = true
    AppStore.emitChange()
    const first_name = this.refs.first_name.refs.input.value.trim()
    const last_name = this.refs.last_name.refs.input.value.trim()
    const email = this.refs.email.refs.input.value.trim()
    const phone_number = this.refs.phone_number.refs.input.value.trim()
    const company = this.refs.company.refs.input.value.trim()
    const role = this.refs.role.refs.input.value.trim()
    const action = this.refs.action.value.trim()

    // Reset errors
    if (AppStore.data.new_contact_modal) {
      delete AppStore.data.new_contact_modal.errors
      delete AppStore.data.new_contact_modal.email_invalid
    }

    // Validations
    if (!AppStore.data.new_contact_modal)
      AppStore.data.new_contact_modal = {}

    if (!first_name || !last_name) {
      AppStore.data.new_contact_modal.errors = true
      AppStore.data.creating_contacts = false
      AppStore.emitChange()
      return
    }

    if (email && !validator.isEmail(email)) {
      AppStore.data.new_contact_modal.email_invalid = true
      AppStore.data.creating_contacts = false
      AppStore.emitChange()
      return
    }

    if (!email && !phone_number) {
      AppStore.data.new_contact_modal.errors = true
      AppStore.data.creating_contacts = false
      AppStore.emitChange()
      return
    }

    const user = this.props.data.user
    if (action === 'create') {
      const contact = {
        first_name,
        last_name,
        role,
        force_creation: true
      }
      // Needs either email or phone
      if (phone_number)
        contact.phone_number = phone_number
      if (email)
        contact.email = email
      if (company)
        contact.company = company
      if (!role.length)
        delete contact.role
      const contacts = [contact]
      AppDispatcher.dispatch({
        action: 'create-contacts',
        contacts,
        user,
        module_type
      })
    }
    if (action === 'edit') {
      // Get default contact info
      const contact = AppStore.data.contact_modal.contact
      contact.first_name = first_name
      contact.last_name = last_name
      contact.email = email
      contact.phone_number = phone_number
      contact.company = company
      contact.role = role
      // Remove contact info (no undef)
      if (!email)
        delete contact.email
      if (!phone_number)
        delete contact.phone_number
      if (!company)
        delete contact.company
      if (!role.length)
        delete contact.role
      AppDispatcher.dispatch({
        action: 'edit-contact',
        contact,
        user,
        module_type
      })
    }
  }

  deleteContact(contact) {
    const user = this.props.data.user
    const transaction = this.props.data.current_transaction
    AppStore.data.current_transaction.deleting_contact = {
      id: contact.id
    }
    AppStore.emitChange()
    TransactionDispatcher.dispatch({
      action: 'delete-contact',
      contact,
      user,
      transaction
    })
  }

  getTransaction(transaction) {
    const data = this.props.data
    const user = data.user
    TransactionDispatcher.dispatch({
      action: 'get-transaction',
      user,
      id: transaction.id
    })
  }

  render() {
    // Data
    const data = this.props.data
    const transactions = data.transactions

    // Transactions
    let transactions_rows
    if (transactions) {
      transactions_rows = transactions.map(transaction => {
        let listing
        let address
        // Price
        let contract_price = transaction.contract_price
        if (contract_price)
          contract_price = '$' + helpers.numberWithCommas(contract_price)
        // Dates
        const important_dates = transaction.important_dates
        let closing_date
        if (important_dates) {
          closing_date = _.result(_.findWhere(important_dates, { title: 'closing' }), 'due_date')
          if (closing_date) {
            closing_date = closing_date.toString()
            closing_date = closing_date.replace('T00:00:00.000Z', '')
          }
        }
        if (transaction.listing) {
          listing = transaction.listing
          address = `${listing.property.address.street_number} ${listing.property.address.street_name}`
        }
        let cover_image = <div style={ S('w-90 h-62 bg-eff1f2 color-929292 text-center pt-20') }>No image</div>
        if (listing && listing.cover_image_url) {
          cover_image = (
            <div style={ S('w-90 h-62 bg-center bg-cover bg-url(' + listing.cover_image_url + ')') }></div>
          )
        }
        let listing_status
        if (listing)
          listing_status = listing.status
        const status_color = listing_util.getStatusColor(listing_status)
        // Get client
        const clients = _.forEach(transaction.contacts, contact => {
          const roles = contact.roles
          if (roles && roles.indexOf('Client') !== -1)
            return contact
        })
        let listing_status_indicator
        if (listing) {
          listing_status_indicator = (
            <div style={ S('color-929394 relative t-10n') }>
              <span style={ S('font-26 relative t-3 color-' + status_color) }>&#8226;</span> { listing.status }
            </div>
          )
        }
        let friendly_date
        if (closing_date) {
          const transaction_time = helpers.convertDateToTime(closing_date)
          friendly_date = helpers.friendlyDate(transaction_time)
        }
        let client_name
        if (clients && clients[0])
          client_name = clients[0].first_name + ' ' + clients[0].last_name
        return (
          <tr onClick={ this.handleClickTransaction.bind(this, transaction) } style={ S('pointer') } key={ transaction.id }>
            <td>
              <div className="pull-left" style={ S('mt-5 ml-5') }>{ cover_image }</div>
              <div className="pull-left" style={ S('ml-20 mt-15 maxw-200') }>
                { address }
                { listing_status_indicator }
              </div>
            </td>
            <td>
              <div style={ S('mt-20') }>
                { client_name }
                <div style={ S('color-929394') }>{ transaction.transaction_type }</div>
              </div>
            </td>
            <td>
              <div style={ S('mt-20') }>
                { contract_price }
              </div>
            </td>
            <td>
              <div style={ S('mt-20') }>
                Tax Document
              </div>
            </td>
            <td>
              <div style={ S('mt-20') }>
                { friendly_date ? `${friendly_date.month} ${friendly_date.date}, ${friendly_date.year}` : 'TBD' }
              </div>
            </td>
          </tr>
        )
      }) // end trans loop
    } // end if (transactions)
    let saved_message
    if (data.new_transaction && data.new_transaction.saved) {
      saved_message = (
        <div style={ S('pl-15 pr-15') }>
          <Alert bsStyle="success">Transaction saved!<button className="close" type="button" onClick={ this.handleCloseSavedAlert.bind(this) }>&times;</button></Alert>
        </div>
      )
    }

    let main_content
    if (transactions_rows && transactions_rows.length) {
      main_content = (
        <div style={ S('pl-15 pr-15') }>
          <Table style={ S('mt-10n minw-760') } className="table--tabbable" condensed hover>
            <thead>
              <tr>
                <th width="150">Property</th>
                <th width="100">Contact</th>
                <th width="100">Price</th>
                <th width="100">Next Task</th>
                <th width="100">Closing Date</th>
              </tr>
            </thead>
            <tbody>
              { transactions_rows }
            </tbody>
          </Table>
        </div>
      )
    } else {
      main_content = (
        <div style={ S('pl-15 pr-15') }>No transactions yet.  Maybe this needs to say something snarky or clever.</div>
      )
    }

    if (data.getting_transactions) {
      main_content = (
        <div style={ S('pl-15 pr-15') }>
          <Loading />
        </div>
      )
    }

    // Single view
    const current_transaction = data.current_transaction
    if (current_transaction) {
      main_content = (
        <TransactionDetail
          data={ data }
          setDrawerContent={ this.setDrawerContent.bind(this) }
          closeDrawer={ this.closeDrawer }
          deleteTransaction={ this.deleteTransaction }
          addDocs={ this.addDocs.bind(this) }
          dragEnter={ this.dragEnter }
          dragLeave={ this.dragLeave }
          hideModal={ this.hideModal }
          uploadFile={ this.uploadFile.bind(this) }
          deleteFile={ this.deleteFile }
          handleNameChange={ this.handleNameChange }
          showEditModal={ this.showEditModal }
          editTransaction={ this.editTransaction }
          openFileViewer={ this.openFileViewer }
          closeFileViewer={ this.closeFileViewer }
          setFilteredContacts={ this.setFilteredContacts.bind(this) }
          setContactActive={ this.setContactActive.bind(this) }
          hideContactsForm={ this.hideContactsForm }
          removeContact={ this.removeContact }
          showContactModal={ this.showContactModal }
          addContact={ this.addContact }
          deleteContact={ this.deleteContact }
          showNewContentInitials={ this.showNewContentInitials }
          getTransaction={ this.getTransaction.bind(this) }
        />
      )
    }

    // Style
    const main_style = S('absolute l-183 r-0')

    return (
      <div style={ S('minw-1000') }>
        <Header data={ data } viewAllTransactions={ this.viewAllTransactions.bind(this) } viewTransaction={ this.viewTransaction.bind(this) } removeTransactionTab={ this.removeTransactionTab } />
        <main style={ S('pt-15') }>
          <SideBar data={ data }/>
          <div style={ main_style }>
            { saved_message }
            { main_content }
          </div>
        </main>
      </div>
    )
  }
}

// PropTypes
Transactions.propTypes = {
  data: React.PropTypes.object,
  route: React.PropTypes.object,
  params: React.PropTypes.object
}