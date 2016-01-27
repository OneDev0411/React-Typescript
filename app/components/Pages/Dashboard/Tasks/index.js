// Dashboard/Tasks/index.js
import React, { Component } from 'react'
import S from 'shorti'
import _ from 'lodash'
import validator from 'validator'

// Partials
import Header from '../Partials/Header'
import SideBar from '../Partials/SideBar'
import TasksModule from '../Modules/Tasks'

// Dispatchers
import AppDispatcher from '../../../../dispatcher/AppDispatcher'
import TransactionDispatcher from '../../../../dispatcher/TransactionDispatcher'
import TaskDispatcher from '../../../../dispatcher/TaskDispatcher'

// AppStore
import AppStore from '../../../../stores/AppStore'

export default class Tasks extends Component {

  componentDidMount() {
    const data = this.props.data
    this.getContacts()
    if (!data.tasks)
      this.getTasks()
    if (!data.tasks)
      this.getAllTransactions()
    AppStore.emitChange()
    setTimeout(() => {
      this.refs.task_title.refs.input.focus()
    }, 100)
    // Esc to close
    document.onkeydown = evt => {
      if (evt.keyCode === 27 && data.current_task && !data.show_contacts_modal)
        this.closeDrawer()
    }
  }

  // Transactions
  getAllTransactions() {
    const user = this.props.data.user
    TransactionDispatcher.dispatch({
      action: 'get-all',
      user
    })
  }

  getTransaction(id) {
    const user = this.props.data.user
    TaskDispatcher.dispatch({
      action: 'get-transaction',
      user,
      id
    })
  }

  // Contacts
  getContacts() {
    const user = this.props.data.user
    AppDispatcher.dispatch({
      action: 'get-contacts',
      user
    })
  }

  getTasks() {
    const data = this.props.data
    const user = data.user
    AppStore.data.getting_tasks = true
    AppStore.emitChange()
    TaskDispatcher.dispatch({
      action: 'get-tasks',
      user
    })
  }

  editTaskStatus(task, status) {
    const data = this.props.data
    const user = data.user
    TaskDispatcher.dispatch({
      action: 'edit-task-status',
      user,
      task,
      status
    })
  }

  deleteTask(task) {
    const data = this.props.data
    const user = data.user
    AppStore.data.deleting_task = task
    AppStore.emitChange()
    TaskDispatcher.dispatch({
      action: 'delete-task',
      user,
      task
    })
  }

  handleAddTaskKeyDown(e) {
    const key = e.which
    const data = this.props.data
    const new_task = data.new_task
    // Tab pressed
    if (key === 9)
      this.showDayPicker()
    // Enter pressed
    if (key === 13) {
      const title = this.refs.task_title.refs.input.value.trim()
      const date = new Date()
      let due_date = date.getTime()
      if (AppStore.data.new_task && AppStore.data.new_task.due_date)
        due_date = AppStore.data.new_task.due_date.getTime()
      e.preventDefault()
      if (title) {
        this.hideDayPicker()
        let contacts
        if (new_task && new_task.contacts)
          contacts = _.pluck(new_task.contacts, 'id')
        const user = data.user
        this.refs.task_title.refs.input.value = ''
        this.refs.task_title.refs.input.focus()
        TaskDispatcher.dispatch({
          action: 'create-task',
          user,
          title,
          due_date,
          contacts
        })
      }
    }
  }

  showDayPicker() {
    if (AppStore.data.show_day_picker)
      delete AppStore.data.show_day_picker
    else
      AppStore.data.show_day_picker = true
    AppStore.emitChange()
  }

  hideDayPicker() {
    delete AppStore.data.show_day_picker
    AppStore.emitChange()
  }

  setTaskDate(e, day) {
    if (!AppStore.data.new_task)
      AppStore.data.new_task = {}
    AppStore.data.new_task.due_date = day
    delete AppStore.data.show_day_picker
    this.refs.task_title.refs.input.focus()
    AppStore.emitChange()
  }

  handleTaskClick(task) {
    AppStore.data.current_task = task
    if (task.transaction && !task.transaction_data) {
      const id = task.transaction
      this.getTransaction(id)
    }
    AppStore.emitChange()
    this.openDrawer()
  }

  openDrawer() {
    AppStore.data.current_task.drawer = true
    AppStore.data.current_task.drawer_active = true
    AppStore.emitChange()
  }

  closeDrawer() {
    delete AppStore.data.current_task.drawer_active
    AppStore.emitChange()
    setTimeout(() => {
      delete AppStore.data.current_task.drawer
      delete AppStore.data.current_task
      AppStore.emitChange()
    }, 200)
  }

  // Share contacts Modal
  showShareTaskModal(type) {
    delete AppStore.data.adding_contacts
    AppStore.data.show_contacts_modal = true
    if (type === 'new')
      AppStore.data.new_task = true
    AppStore.emitChange()
  }

  hideModal() {
    delete AppStore.data.show_contacts_modal
    delete AppStore.data.filtered_contacts
    delete AppStore.data.new_task
    delete AppStore.data.show_transactions_modal
    delete AppStore.data.transaction_results
    AppStore.emitChange()
  }

  hideAddContactModal() {
    delete AppStore.data.show_contact_modal
    AppStore.emitChange()
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
    AppStore.data.current_task.contacts_added = AppStore.data.contacts_added
    AppStore.emitChange()
  }

  showContactModal(contact) {
    delete AppStore.data.new_contact_modal
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

    // Remove search input value
    this.refs.search_contacts.refs.input.value = ''

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
      delete AppStore.data.creating_contacts
      AppStore.emitChange()
      return
    }

    if (email && !validator.isEmail(email)) {
      AppStore.data.new_contact_modal.email_invalid = true
      delete AppStore.data.creating_contacts
      AppStore.emitChange()
      return
    }

    if (!email && !phone_number) {
      AppStore.data.new_contact_modal.errors = true
      delete AppStore.data.creating_contacts
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

  addContactsToTask() {
    AppStore.data.adding_contacts = true
    AppStore.emitChange()
    const data = this.props.data
    const new_task = data.new_task
    const user = data.user
    const task = data.current_task
    const contacts = AppStore.data.contacts_added['share-task']
    const contact_ids = _.pluck(contacts, 'id')
    // New task
    if (!new_task) {
      TaskDispatcher.dispatch({
        action: 'add-contacts',
        user,
        task,
        contacts: contact_ids
      })
    // Editing task
    } else {
      delete AppStore.data.adding_contacts
      delete AppStore.data.show_contacts_modal
      AppStore.data.new_task = {
        contacts
      }
      AppStore.emitChange()
      setTimeout(() => {
        this.refs.task_title.refs.input.focus()
      }, 300)
    }
  }

  removeContactFromTask(contact) {
    const data = this.props.data
    const user = data.user
    const task = data.current_task
    TaskDispatcher.dispatch({
      action: 'remove-contact',
      user,
      task,
      contact
    })
  }

  // Transactions
  showAddTransactionModal() {
    delete AppStore.data.transaction_results
    AppStore.data.show_transactions_modal = true
    AppStore.emitChange()
    setTimeout(() => {
      this.refs.search_transactions.refs.input.focus()
    }, 300)
  }

  searchTransactions() {
    const data = this.props.data
    const transactions = data.transactions
    const search_text = this.refs.search_transactions.refs.input.value
    if (!search_text.trim()) {
      delete AppStore.data.transaction_results
      AppStore.emitChange()
      return
    }
    const transaction_results = transactions.filter(transaction => {
      if (transaction.title.includes(search_text))
        return true
      if (transaction.listing_data)
        return transaction.listing_data.property.address.street_full.includes(search_text)
      return false
    })
    AppStore.data.transaction_results = transaction_results
    AppStore.emitChange()
  }

  navTransactionsList(e) {
    const transaction_results = this.props.data.transaction_results
    if (e.which === 38)
      this.setTransactionActive('up')
    if (e.which === 40)
      this.setTransactionActive('down')
    if (e.which === 13 && transaction_results) {
      const active_transaction = this.props.data.active_transaction
      const transaction = transaction_results[active_transaction]
      this.addTransactionToTask(transaction)
    }
  }

  setTransactionActive(direction) {
    const data = this.props.data
    const transaction_results = data.transaction_results
    let active_transaction = -1

    // Prev active contact
    if (data.active_transaction !== null)
      active_transaction = data.active_transaction

    if (direction === 'up') {
      if (active_transaction > -1)
        active_transaction = active_transaction - 1
      else
        active_transaction = transaction_results.length - 1
    }

    if (direction === 'down') {
      if (active_transaction < transaction_results.length - 1)
        active_transaction = active_transaction + 1
      else
        active_transaction = 0
    }
    AppStore.data.active_transaction = active_transaction
    AppStore.emitChange()
  }

  addTransactionToTask(transaction) {
    // console.log(transaction)
    const data = this.props.data
    const user = data.user
    const task = data.current_task
    TaskDispatcher.dispatch({
      action: 'add-transaction',
      user,
      transaction,
      task
    })
  }

  render() {
    const data = this.props.data
    return (
      <div style={ S('minw-1000') }>
        <Header data={ data }/>
        <main style={ S('pt-15') }>
          <SideBar data={ data }/>
          <TasksModule
            data={ data }
          />
        </main>
      </div>
    )
  }
}

// PropTypes
Tasks.propTypes = {
  data: React.PropTypes.object
}