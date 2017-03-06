// Dashboard/Transactions/Single/index.js
import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import { Alert } from 'react-bootstrap'
import S from 'shorti'
import _ from 'lodash'

// AppStore
import AppStore from '../../../../../stores/AppStore'

// AppDispatcher
import AppDispatcher from '../../../../../dispatcher/AppDispatcher'

// TransactionDispatcher
import TransactionDispatcher from '../../../../../dispatcher/TransactionDispatcher'

// Partials
import SideBar from '../../Partials/SideBar'
import Header from '../../Partials/Header'
import TransactionDetail from './Partials/TransactionDetail'

export default class Transactions extends Component {

  componentDidMount() {
    const data = this.props.data
    this.getContacts()
    delete AppStore.data.current_task
    // If coming from redirect
    if (AppStore.data.new_transaction && AppStore.data.new_transaction.saved) {
      setTimeout(() => {
        delete AppStore.data.new_transaction.redirect_to
        delete AppStore.data.new_transaction.saved
        AppStore.emitChange()
      }, 3000)
    }
    // From Link to single transaction
    const params = this.props.params
    if (params && params.id)
      this.getTransaction(params.id)
    // Reorder attachments
    let attachments = data.attachments
    if (attachments) {
      attachments = _.sortBy(attachments, attachment => {
        return attachment.created_at * -1
      })
      AppStore.data.attachments = attachments
    }
    AppStore.emitChange()
    this.acknowledge(params.id)
  }

  getContacts() {
    const data = this.props.data
    AppDispatcher.dispatch({
      action: 'get-contacts',
      user: data.user
    })
  }

  setDrawerContent(key, keep_open) {
    delete AppStore.data.current_task
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
    if (!_.find(transaction_tabs, { id: transaction.id }))
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

  viewTransaction(transaction) {
    // Remove current task
    delete AppStore.data.current_task
    AppStore.emitChange()
    const attachments = transaction.attachments
    const attachments_sorted = _.sortBy(attachments, 'created', attachment => {
      return - attachment.created
    })
    transaction.attachments = attachments_sorted
    AppStore.data.current_transaction = transaction
    browserHistory.push('/dashboard/transactions/' + transaction.id)
    AppStore.emitChange()
  }

  acknowledge(transaction) {
    const user = this.props.data.user
    TransactionDispatcher.dispatch({
      action: 'acknowledge-transaction',
      user,
      transaction
    })
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

      browserHistory.push('/dashboard/transactions')
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
    delete AppStore.data.doc_switch_checked
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
    // Check for private
    if (data.doc_switch_checked)
      current_file.private = data.doc_switch_checked
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
      // this.file_nameInput.value = next_file.name
      AppStore.data.document_modal.current_file = next_file
    }
    delete AppStore.data.document_modal.editing_name
    AppStore.emitChange()
  }

  deleteFile(file) {
    const data = this.props.data
    const user = data.user
    const transaction = data.current_transaction
    let attachments = transaction.attachments
    attachments = attachments.map(attachment => {
      if (file.id === attachment.id)
        attachment.is_deleting = true
      return attachment
    })
    AppStore.data.current_transaction.attachments = attachments
    AppStore.emitChange()
    TransactionDispatcher.dispatch({
      action: 'delete-file',
      user,
      transaction: transaction.id,
      file: file.id
    })
  }

  addDocs(files) {
    this.showDocModal(files)
    AppStore.emitChange()
  }

  dragEnter() {
    this.setDrawerContent('docs', true)
    AppStore.data.current_transaction.overlay_active = true
    AppStore.emitChange()
  }

  dragLeave() {
    delete AppStore.data.current_transaction.overlay_active
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
    browserHistory.push('/dashboard/transactions/' + transaction.id)
    AppStore.emitChange()
  }

  deleteContact(contact) {
    const user = this.props.data.user
    const transaction = this.props.data.current_transaction
    AppStore.data.current_transaction.deleting_contact = {
      id: contact.id
    }
    AppStore.emitChange()
    TransactionDispatcher.dispatch({
      action: 'delete-role',
      contact,
      user,
      transaction
    })
  }

  getTransaction(id) {
    const data = this.props.data
    const user = data.user
    TransactionDispatcher.dispatch({
      action: 'get-transaction',
      user,
      id
    })
  }

  uploadFilePermission(check) {
    if (check)
      AppStore.data.doc_switch_checked = true
    else
      delete AppStore.data.doc_switch_checked
    AppStore.emitChange()
  }

  render() {
    // Data
    const data = this.props.data
    let saved_message
    if (data.new_transaction && data.new_transaction.saved) {
      saved_message = (
        <div style={ S('pl-15 pr-15') }>
          <Alert bsStyle="success">Transaction saved!<button className="close" type="button" onClick={ this.handleCloseSavedAlert.bind(this) }>&times;</button></Alert>
        </div>
      )
    }

    let main_content
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
          deleteContact={ this.deleteContact }
          getTransaction={ this.getTransaction.bind(this) }
          uploadFilePermission={ this.uploadFilePermission }
        />
      )
    }

    // Style
    const main_style = S('absolute l-70 r-0')

    return (
      <div style={ S('minw-1000') }>
        <Header
          data={ data }
          viewTransaction={ this.viewTransaction.bind(this) }
          removeTransactionTab={ this.removeTransactionTab }
        />
        <main style={ S('pt-15') }>
          <SideBar
            data={ data }
          />
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
  params: React.PropTypes.object,
  uploadFilePermission: React.PropTypes.func
}
