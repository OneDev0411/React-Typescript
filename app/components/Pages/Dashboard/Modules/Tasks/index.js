// Modules/Tasks/index.js
import React, { Component } from 'react'
import _ from 'lodash'
import helpers from '../../../../../utils/helpers'

// Partials
import MainContent from './Partials/MainContent'

// AppStore
import AppStore from '../../../../../stores/AppStore'

// Dispatchers
import AppDispatcher from '../../../../../dispatcher/AppDispatcher'
import TransactionDispatcher from '../../../../../dispatcher/TransactionDispatcher'
import TaskDispatcher from '../../../../../dispatcher/TaskDispatcher'

export default class TasksModule extends Component {

  componentDidMount() {
    const data = this.props.data
    this.getContacts()
    if (!data.tasks)
      this.getTasks()
    if (!data.tasks)
      this.getAllTransactions()
    AppStore.emitChange()
    // Esc to close
    document.onkeydown = evt => {
      if (evt.keyCode === 27 && data.current_task && !data.show_contacts_modal)
        this.closeDrawer()
    }

    this.discardNotifications()
  }

  componentWillUnmount() {
    // Resets
    if (AppStore.data.contacts_added)
      delete AppStore.data.contacts_added
    if (AppStore.data.new_task)
      delete AppStore.data.new_task
    if (AppStore.data.show_day_picker)
      delete AppStore.data.show_day_picker
    AppStore.emitChange()
  }

  discardNotifications() {
    const user = this.props.data.user
    TaskDispatcher.dispatch({
      action: 'acknowledge-notifications',
      user
    })
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

  createTask(title) {
    const data = this.props.data
    const new_task = data.new_task
    const date = new Date()
    // Default due_date to today
    let due_date = date.getTime() / 1000
    const module_type = this.props.module_type
    let transaction
    if (module_type === 'transaction')
      transaction = data.current_transaction
    if (new_task && new_task.due_date)
      due_date = new_task.due_date / 1000
    let contacts
    if (new_task)
      contacts = new_task.contacts
    if (title) {
      this.hideDayPicker()
      const user = data.user
      TaskDispatcher.dispatch({
        action: 'create-task',
        user,
        title,
        due_date,
        contacts,
        transaction
      })
    }
  }

  removeSearchContacts() {
    delete AppStore.data.search_contacts
    AppStore.emitChange()
  }

  searchContacts(text_input, search_text) {
    if (!search_text.trim()) {
      AppStore.data.search_contacts = {
        list: [],
        position: text_input.selectionEnd
      }
      AppStore.emitChange()
      return
    }
    const data = this.props.data
    const contacts = data.contacts
    const contacts_filtered = contacts.filter(contact => {
      let first_name
      let email
      if (contact.first_name) {
        first_name = contact.first_name.toLowerCase()
        if (first_name.search(search_text.toLowerCase()) !== -1)
          return true
      }
      if (contact.email) {
        email = contact.email.toLowerCase()
        if (email.search(search_text.toLowerCase()) !== -1)
          return true
      }
      return false
    })
    if (!AppStore.data.search_contacts)
      AppStore.data.search_contact = {}
    AppStore.data.search_contacts.list = contacts_filtered
    AppStore.emitChange()
  }

  showDayPicker(action) {
    if (action === 'create') {
      delete AppStore.data.show_day_picker_edit
      if (AppStore.data.show_day_picker)
        delete AppStore.data.show_day_picker
      else
        AppStore.data.show_day_picker = true
    }
    if (action === 'edit') {
      delete AppStore.data.show_day_picker
      if (AppStore.data.show_day_picker_edit)
        delete AppStore.data.show_day_picker_edit
      else
        AppStore.data.show_day_picker_edit = true
    }
    AppStore.emitChange()
  }

  hideDayPicker() {
    delete AppStore.data.show_day_picker
    delete AppStore.data.show_day_picker_edit
    AppStore.emitChange()
  }

  setTaskDate(e, day) {
    if (!AppStore.data.new_task)
      AppStore.data.new_task = {}
    AppStore.data.new_task.due_date = day
    // delete AppStore.data.show_day_picker
    // this.refs.task_title.refs.input.focus()
    AppStore.emitChange()
  }

  setEditTaskDate(e, day) {
    if (!AppStore.data.current_task)
      AppStore.data.current_task = {}
    const seconds = day.getTime() / 1000
    AppStore.data.current_task.due_date = seconds
    // delete AppStore.data.show_day_picker
    // this.refs.task_title.refs.input.focus()
    AppStore.emitChange()
  }

  setTaskDateTime(hours, minutes, suffix) {
    if (!AppStore.data.new_task)
      AppStore.data.new_task = {}
    const due_date = AppStore.data.new_task.due_date
    const due_date_object = new Date(due_date)
    const midnight_date = new Date(due_date_object.setHours(0, 0, 0, 0))
    const due_date_miliseconds = helpers.addTimeToDate(midnight_date, parseInt(hours, 10), parseInt(minutes, 10), suffix)
    AppStore.data.new_task.due_date = due_date_miliseconds
    delete AppStore.data.show_day_picker
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
    const data = this.props.data
    if (type === 'new' && !data.new_task)
      AppStore.data.new_task = {}
    delete AppStore.data.adding_contacts
    AppStore.data.show_contacts_modal = true
    AppStore.emitChange()
  }

  hideModal() {
    delete AppStore.data.show_contacts_modal
    delete AppStore.data.filtered_contacts
    delete AppStore.data.new_task
    delete AppStore.data.show_transactions_modal
    delete AppStore.data.transaction_results
    delete AppStore.data.show_snooze_modal
    if (AppStore.data.current_task)
      delete AppStore.data.current_task.snooze
    AppStore.emitChange()
  }

  addContactsToTask() {
    AppStore.data.adding_contacts = true
    AppStore.emitChange()
    const data = this.props.data
    const new_task = data.new_task
    const user = data.user
    const task = data.current_task
    const contacts = AppStore.data.contacts_added['share-task']
    const current_contacts = contacts.filter(contact => {
      return contact.type === 'contact'
    })
    const new_contacts = contacts.filter(contact => {
      return contact.type !== 'contact'
    })
    if (new_contacts) {
      // Create contacts if email or phone
      AppDispatcher.dispatch({
        action: 'create-contacts',
        user,
        contacts: new_contacts,
        module_type: 'share-task'
      })
    }
    const current_contacts_ids = _.pluck(current_contacts, 'id')
    // New task
    if (!new_task) {
      TaskDispatcher.dispatch({
        action: 'add-contacts',
        user,
        task,
        contacts: current_contacts_ids
      })
    // Editing task
    } else {
      delete AppStore.data.adding_contacts
      delete AppStore.data.show_contacts_modal
      AppStore.data.new_task.contacts = contacts
      AppStore.emitChange()
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

  editTaskTitle(task, title) {
    const data = this.props.data
    const user = data.user
    AppStore.data.current_task.title = title
    AppStore.emitChange()
    clearTimeout(window.edit_timer)
    window.edit_timer = setTimeout(() => {
      TaskDispatcher.dispatch({
        action: 'edit-title',
        user,
        task,
        title
      })
    }, 500)
  }

  editTaskDate(due_date_miliseconds) {
    const due_date_seconds = due_date_miliseconds / 1000
    const data = this.props.data
    const user = data.user
    const current_task = data.current_task
    delete AppStore.data.show_day_picker_edit
    // Show immediately
    AppStore.data.current_task.due_date = due_date_seconds
    AppStore.emitChange()
    TaskDispatcher.dispatch({
      action: 'edit-date',
      user,
      task: current_task,
      due_date: due_date_seconds
    })
  }

  addContactFromSearch(contact) {
    if (!AppStore.data.contacts_added) {
      AppStore.data.contacts_added = {
        'share-task': []
      }
    }
    delete AppStore.data.search_contacts
    // prevent dupe
    if (!AppStore.data.contacts_added['share-task'])
      AppStore.data.contacts_added['share-task'] = []
    if (!_.find(AppStore.data.contacts_added['share-task'], { id: contact.id }))
      AppStore.data.contacts_added['share-task'].push(contact)
    AppStore.data.new_task = {}
    AppStore.emitChange()
    this.addContactsToTask()
  }

  setContactActive(direction) {
    const data = this.props.data
    const search_contacts_list = data.search_contacts.list
    let active_contact = -1

    // Prev active contact
    if (data.active_contact !== null)
      active_contact = data.active_contact

    if (direction === 'up') {
      if (active_contact > -1)
        active_contact = active_contact - 1
      else
        active_contact = search_contacts_list.length - 1
    }

    if (direction === 'down') {
      if (active_contact < search_contacts_list.length - 1)
        active_contact = active_contact + 1
      else
        active_contact = 0
    }
    AppStore.data.active_contact = active_contact
    AppStore.emitChange()
  }

  showSnoozeModal() {
    AppStore.data.show_snooze_modal = true
    AppStore.emitChange()
  }

  setSnoozeDate(e, day) {
    AppStore.data.current_task.snooze.date_selected = day
    AppStore.emitChange()
  }

  snoozeTaskSave() {
    const data = this.props.data
    const user = data.user
    const current_task = data.current_task
    const snooze_option = AppStore.data.current_task.snooze.option
    const date = new Date()
    const seconds = date.getTime() / 1000
    let due_date_seconds
    switch (snooze_option) {
      case 'hour':
        due_date_seconds = seconds + 3600
        break
      case 'tomorrow':
        const tommorows_date = new Date(date.setHours(24, 0, 0, 0))
        const tomorrow_morning_seconds = (tommorows_date.getTime() / 1000) + 32400
        due_date_seconds = tomorrow_morning_seconds
        break
      case 'date':
        const date_selected = AppStore.data.current_task.snooze.date_selected
        due_date_seconds = date_selected.getTime() / 1000
        break
      default:
        return
    }
    TaskDispatcher.dispatch({
      action: 'edit-date',
      user,
      task: current_task,
      due_date: due_date_seconds
    })
    delete AppStore.data.show_snooze_modal
    AppStore.data.current_task.due_date = due_date_seconds
    AppStore.emitChange()
    setTimeout(() => {
      delete AppStore.data.current_task.snooze
      AppStore.emitChange()
    }, 200)
  }

  setSnoozeOption(option) {
    AppStore.data.current_task.snooze = {
      option
    }
    AppStore.emitChange()
  }

  render() {
    const data = this.props.data
    return (
      <MainContent
        data={ data }
        module_type={ this.props.module_type }
        addTransactionToTask={ this.addTransactionToTask }
        containing_body_height={ this.props.containing_body_height }
        editTaskStatus={ this.editTaskStatus }
        deleteTask={ this.deleteTask }
        handleTaskClick={ this.handleTaskClick.bind(this) }
        showDayPicker={ this.showDayPicker }
        showShareTaskModal={ this.showShareTaskModal }
        closeDrawer={ this.closeDrawer }
        removeContactFromTask={ this.removeContactFromTask }
        showAddTransactionModal={ this.showAddTransactionModal }
        editTaskTitle={ this.editTaskTitle }
        editTaskDate={ this.editTaskDate.bind(this) }
        setEditTaskDate={ this.setEditTaskDate }
        hideDayPicker={ this.hideDayPicker }
        addContactsToTask={ this.addContactsToTask }
        navTransactionsList={ this.navTransactionsList.bind(this) }
        searchTransactions={ this.searchTransactions }
        showSnoozeModal={ this.showSnoozeModal }
        snoozeTaskSave={ this.snoozeTaskSave }
        searchContacts={ this.searchContacts.bind(this) }
        hideModal={ this.hideModal.bind(this) }
        setTaskDate={ this.setTaskDate }
        setTaskDateTime={ this.setTaskDateTime }
        setContactActive={ this.setContactActive.bind(this) }
        createTask={ this.createTask.bind(this) }
        addContactFromSearch={ this.addContactFromSearch.bind(this) }
        removeSearchContacts={ this.removeSearchContacts }
        setSnoozeOption={ this.setSnoozeOption }
        setSnoozeDate={ this.setSnoozeDate }
      />
    )
  }
}

// PropTypes
TasksModule.propTypes = {
  data: React.PropTypes.object,
  module_type: React.PropTypes.string,
  containing_body_height: React.PropTypes.number
}