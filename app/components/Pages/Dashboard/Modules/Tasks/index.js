// Modules/Tasks/index.js
import React, { Component } from 'react'
import { Button, Input, Modal } from 'react-bootstrap'
import S from 'shorti'
import _ from 'lodash'
import helpers from '../../../../../utils/helpers'
import DayPicker from 'react-day-picker'

// Modules
import AddContactsModule from '../AddContacts'

// Partials
import TasksList from './Partials/TasksList'
import Drawer from './Partials/Drawer'
import Loading from '../../../../Partials/Loading'
import Transaction from './Partials/Transaction'
import ProfileImage from '../../Partials/ProfileImage'

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
    if (data.location.pathname === '/dashboard/tasks') {
      setTimeout(() => {
        this.refs.task_title.refs.input.focus()
      }, 100)
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

  createTask() {
    const data = this.props.data
    const new_task = data.new_task
    const title = this.refs.task_title.refs.input.value.trim()
    const date = new Date()
    let due_date = date.getTime()
    const module_type = this.props.module_type
    let transaction
    if (module_type === 'transaction')
      transaction = data.current_transaction
    if (AppStore.data.new_task && AppStore.data.new_task.due_date)
      due_date = AppStore.data.new_task.due_date.getTime()
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
        contacts,
        transaction
      })
    }
  }

  handleAddTaskKeyDown(e) {
    const key = e.which
    const data = this.props.data
    // Tab pressed
    if (key === 9)
      this.showDayPicker()
    // Enter pressed
    if (key === 13) {
      e.preventDefault()
      // Select contact from search
      if (data.search_contacts && data.search_contacts.list) {
        const active_contact_index = data.active_contact
        const active_contact = data.search_contacts.list[active_contact_index]
        this.addContactFromSearch(active_contact)
      } else
        this.createTask()
    }
    // Up / down nav searched contacts
    if (data.search_contacts && data.search_contacts.list) {
      if (key === 38)
        this.setContactActive('up')
      if (key === 40)
        this.setContactActive('down')
    }
  }

  handleAddTaskKeyUp() {
    // Check for @
    const text_input = this.refs.task_title.refs.input
    const task_title = text_input.value
    if (task_title.indexOf('@') !== -1) {
      // Split after @
      const search_arr = task_title.split('@')
      const search_text = search_arr[1]
      this.searchContacts(text_input, search_text)
    } else {
      delete AppStore.data.search_contacts
      AppStore.emitChange()
    }
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
      const first_name = contact.first_name.toLowerCase()
      const email = contact.email.toLowerCase()
      if (first_name.search(search_text.toLowerCase()) !== -1)
        return true
      if (email.search(search_text.toLowerCase()) !== -1)
        return true
      return false
    })
    if (!AppStore.data.search_contacts)
      AppStore.data.search_contact = {}
    AppStore.data.search_contacts.list = contacts_filtered
    AppStore.emitChange()
  }

  showDayPicker(action) {
    if (action === 'create') {
      if (AppStore.data.show_day_picker)
        delete AppStore.data.show_day_picker
      else
        AppStore.data.show_day_picker = true
    }
    if (action === 'edit') {
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

  editTaskDate(e, day) {
    const data = this.props.data
    const user = data.user
    const due_date = day.getTime()
    const task = AppStore.data.current_task
    AppStore.data.current_task.due_date = due_date
    delete AppStore.data.show_day_picker_edit
    AppStore.emitChange()
    TaskDispatcher.dispatch({
      action: 'edit-date',
      user,
      task,
      due_date
    })
  }

  addContactFromSearch(contact) {
    if (!AppStore.data.contacts_added) {
      AppStore.data.contacts_added = {
        'share-task': []
      }
    }
    const text_input = this.refs.task_title.refs.input
    const task_title = text_input.value
    const search_arr = task_title.split('@')
    text_input.value = `${search_arr[0]}${contact.first_name} ${contact.last_name} `
    delete AppStore.data.search_contacts
    // prevent dupe
    if (!_.find(AppStore.data.contacts_added['share-task'], { id: contact.id }))
      AppStore.data.contacts_added['share-task'].push(contact)
    AppStore.data.new_task = true
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

  render() {
    const data = this.props.data
    const new_task = data.new_task
    const current_task = data.current_task
    const module_type = this.props.module_type
    let main_content = <Loading />
    if (data.getting_tasks)
      main_content = <Loading />
    else {
      main_content = (
        <TasksList
          data={ data }
          editTaskStatus={ this.editTaskStatus.bind(this) }
          deleteTask={ this.deleteTask.bind(this) }
          handleTaskClick={ this.handleTaskClick.bind(this) }
          module_type={ this.props.module_type }
        />
      )
    }
    let date = new Date()
    const today = helpers.friendlyDate(date.getTime() / 1000)
    let day_picker
    if (data.show_day_picker) {
      day_picker = (
        <div style={ S('absolute bg-fff z-10 t-110 l-10n') }>
          <DayPicker onDayClick={ this.setTaskDate.bind(this) } />
        </div>
      )
    }
    let due_date_area = (
      <span>Today { `${today.day}, ${today.month} ${today.date}, ${today.year}` }</span>
    )
    if (data.new_task && data.new_task.due_date) {
      date = new Date(data.new_task.due_date)
      const due_date_obj = helpers.friendlyDate(date.getTime() / 1000)
      due_date_area = (
        <span>{ `${due_date_obj.day}, ${due_date_obj.month} ${due_date_obj.date}, ${due_date_obj.year}` }</span>
      )
    }
    let open_class = ''
    if (current_task && current_task.drawer_active && module_type === 'tasks')
      open_class = ' drawer-open'

    let share_new_task_area = (
      <span>
        Share this task with others
      </span>
    )
    if (new_task && new_task.contacts) {
      const new_task_contacts = new_task.contacts
      share_new_task_area = new_task_contacts.map((contact, i) => {
        return (
          <span style={ S('mr-10') } key={ 'share-new-' + contact.id }>
            { contact.first_name }{ i !== new_task_contacts.length - 1 ? ',' : ''}
          </span>
        )
      })
    }
    // Transactions
    let transaction_results_area
    if (data.transaction_results) {
      const transaction_results = data.transaction_results
      let transaction_results_list
      const active_transaction = data.active_transaction
      transaction_results_list = transaction_results.map((transaction, i) => {
        let active_style = ''
        if (i === active_transaction)
          active_style = ' bg-f5fafe'
        const transaction_style = {
          ...S('h-80 p-10 w-100p pointer' + active_style),
          borderBottom: '1px solid #edf1f3'
        }
        return (
          <div onClick={ this.addTransactionToTask.bind(this, transaction) } className="search-transaction__list-item" style={ transaction_style } key={ 'transaction-' + transaction.id }>
            <Transaction
              transaction={ transaction }
            />
          </div>
        )
      })
      if (!transaction_results.length) {
        transaction_results_list = (
          <div style={ S('p-10') }>No results</div>
        )
      }
      transaction_results_area = (
        <div style={ { ...S('maxh-320 absolute bg-fff z-100 w-568 br-3 bw-1 bc-ccc solid'), overflow: 'scroll' } }>
          { transaction_results_list }
        </div>
      )
    }
    let wrapper_style
    let main_style = S('absolute r-0')
    // Module type styles
    if (module_type === 'tasks') {
      main_style = {
        ...main_style,
        ...S('l-183')
      }
    }
    if (module_type === 'transaction') {
      delete main_style.position
      delete main_style.top
      delete main_style.right
    }
    // Search box
    let search_contacts_area
    if (data.search_contacts) {
      const search_contacts_position = data.search_contacts.position
      const active_contact = data.active_contact
      const search_box_style = S('p-5 absolute bg-fff br-3 z-100 t-50 minw-200 bw-1 bc-ccc solid l-' + (search_contacts_position * 8))
      let search_box_content = (
        <div style={ S('p-10 color-929292') }>Mention someone by name or email</div>
      )
      if (data.search_contacts.list && data.search_contacts.list.length) {
        const search_contacts_list = data.search_contacts.list
        search_box_content = search_contacts_list.map((contact, i) => {
          let active_contact_style = ''
          if (active_contact === i)
            active_contact_style = ' bg-EDF7FD'
          return (
            <div key={ 'contact-search-' + contact.id }>
              <div onClick={ this.addContactFromSearch.bind(this, contact) } className="add-contact-form__contact" key={ 'contact-' + contact.id } style={ S('br-3 relative h-60 pointer mb-5 p-10' + active_contact_style) }>
                <ProfileImage user={ contact }/>
                <div style={ S('ml-50') }>
                  <span style={ S('fw-600') }>{ contact.first_name } { contact.last_name }</span><br />
                  <span style={ S('color-666') }>{ contact.email }</span>
                </div>
                <div className="clearfix"></div>
              </div>
            </div>
          )
        })
      }
      search_contacts_area = (
        <div style={ search_box_style }>
          { search_box_content }
        </div>
      )
    }
    return (
      <div style={ wrapper_style }>
        <div className={ 'task-list' + open_class } style={ main_style }>
          <div style={ S('ml-15') }>
            <div style={ S('mr-15 relative') }>
              <form>
                <Input onKeyUp={ this.handleAddTaskKeyUp.bind(this) } onKeyDown={ this.handleAddTaskKeyDown.bind(this) } style={ { ...S('h-110 pt-12 font-18'), resize: 'none' } } ref="task_title" type="textarea" placeholder="Type your task then press enter"/>
                { search_contacts_area }
                <div style={ S('absolute b-0 pl-15 pb-15 pointer') }>
                  <div className="pull-left" style={ S('color-3388ff') } onClick={ this.showDayPicker.bind(this, 'create') }>
                    <span style={ S('mr-10') }>
                      <img width="17" src="/images/dashboard/icons/calendar-blue.svg"/>
                    </span>
                    <span style={ S('relative t-1 font-16') }>
                      { due_date_area }
                    </span>
                  </div>
                  <div onClick={ this.showShareTaskModal.bind(this, 'new') } style={ S('absolute l-230 t-4n w-300 color-929292 font-12') } className="pull-left">
                    <span>
                      <img style={ S('w-34 h-34') } src="/images/dashboard/icons/invite-user.svg"/>
                    </span>
                    { share_new_task_area }
                  </div>
                </div>
                { day_picker }
              </form>
            </div>
            { main_content }
          </div>
        </div>
        <Drawer
          data={ data }
          closeDrawer={ this.closeDrawer.bind(this) }
          editTaskStatus={ this.editTaskStatus.bind(this) }
          deleteTask={ this.deleteTask.bind(this) }
          showShareTaskModal={ this.showShareTaskModal.bind(this) }
          removeContactFromTask={ this.removeContactFromTask.bind(this) }
          showAddTransactionModal={ this.showAddTransactionModal.bind(this) }
          module_type={ module_type }
          containing_body_height={ this.props.containing_body_height }
          editTaskTitle={ this.editTaskTitle.bind(this) }
          showDayPicker={ this.showDayPicker.bind(this, 'edit') }
          editTaskDate={ this.editTaskDate.bind(this) }
        />
        <Modal show={ data.show_contacts_modal } onHide={ this.hideModal }>
          <Modal.Header closeButton style={ S('h-45 bc-f3f3f3') }>
           <Modal.Title style={ S('font-14') }>Share Task <span style={ S('color-929292 fw-400') }>(use any email or any phone number)</span></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <AddContactsModule
              data={ data }
              module_type="share-task"
            />
          </Modal.Body>
          <Modal.Footer style={ { border: 'none' } }>
            <Button bsStyle="link" onClick={ this.hideModal }>Cancel</Button>
            <Button onClick={ this.addContactsToTask.bind(this) } style={ S('h-30 pt-5 pl-30 pr-30') } className={ data.adding_contacts ? 'disabled' : '' } type="submit" bsStyle="primary">
              { data.adding_contacts ? 'Saving...' : 'Save' }
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={ data.show_transactions_modal } onHide={ this.hideModal }>
          <Modal.Header closeButton style={ S('h-45 bc-f3f3f3') }>
           <Modal.Title style={ S('font-14') }>Add a Transaction <span style={ S('color-929292 fw-400') }>(you can assign one transaction per task)</span></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Input type="text" ref="search_transactions" placeholder="Search for a transaction" onKeyDown={ this.navTransactionsList.bind(this) } onKeyUp={ this.searchTransactions.bind(this) }/>
            { transaction_results_area }
          </Modal.Body>
        </Modal>
      </div>
    )
  }
}

// PropTypes
TasksModule.propTypes = {
  data: React.PropTypes.object,
  module_type: React.PropTypes.string,
  containing_body_height: React.PropTypes.number
}