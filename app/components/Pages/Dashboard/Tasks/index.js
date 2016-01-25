// Dashboard/Tasks/index.js
import React, { Component } from 'react'
import S from 'shorti'
import _ from 'lodash'
import { Input, Modal, Button } from 'react-bootstrap'
import DayPicker from 'react-day-picker'
import validator from 'validator'

// Helpers
import helpers from '../../../../utils/helpers'

// Partials
import Header from '../Partials/Header'
import SideBar from '../Partials/SideBar'
import Loading from '../../../Partials/Loading'
import TasksList from './Partials/TasksList'
import Drawer from './Partials/Drawer'
import AddContactsForm from '../Partials/AddContactsForm'

// Dispatchers
import AppDispatcher from '../../../../dispatcher/AppDispatcher'
import TaskDispatcher from '../../../../dispatcher/TaskDispatcher'

// AppStore
import AppStore from '../../../../stores/AppStore'

export default class Tasks extends Component {

  componentDidMount() {
    const data = this.props.data
    this.getContacts()
    if (!data.tasks)
      this.getTasks()
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

  handleKeyDown(e) {
    const key = e.which
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
        const data = this.props.data
        const user = data.user
        this.refs.task_title.refs.input.value = ''
        this.refs.task_title.refs.input.focus()
        TaskDispatcher.dispatch({
          action: 'create-task',
          user,
          title,
          due_date
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
  showShareContactsModal() {
    delete AppStore.data.adding_contacts
    AppStore.data.show_contacts_modal = true
    AppStore.emitChange()
  }

  hideModal() {
    delete AppStore.data.show_contacts_modal
    delete AppStore.data.filtered_contacts
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
    const user = data.user
    const task = data.current_task
    const contacts = AppStore.data.contacts_added['share-task']
    const contact_ids = _.pluck(contacts, 'id')
    TaskDispatcher.dispatch({
      action: 'add-contacts',
      user,
      task,
      contacts: contact_ids
    })
  }

  render() {
    const data = this.props.data
    const current_task = data.current_task
    const main_style = S('absolute l-183 r-0')
    let main_content = <Loading />
    if (data.getting_tasks)
      main_content = <Loading />
    else {
      main_content = (
        <TasksList
          data={ data }
          editTaskStatus={ this.editTaskStatus.bind(this) }
          deleteTask={ this.deleteTask }
          handleTaskClick={ this.handleTaskClick.bind(this) }
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
    if (current_task && current_task.drawer_active)
      open_class = ' drawer-open'
    return (
      <div style={ S('minw-1000') }>
        <Header data={ data }/>
        <main style={ S('pt-15') }>
          <SideBar data={ data }/>
          <div className={ 'task-list' + open_class } style={ main_style }>
            <div style={ S('ml-15') }>
              <div style={ S('mr-15 relative') }>
                <form>
                  <Input onKeyDown={ this.handleKeyDown.bind(this) } style={ { ...S('h-110 pt-12 font-18'), resize: 'none' } } ref="task_title" type="textarea" placeholder="Type your task then press enter"/>
                  <div style={ S('absolute b-0 pl-15 pb-15 pointer') }>
                    <div className="pull-left" style={ S('color-3388ff') } onClick={ this.showDayPicker }>
                      <span style={ S('mr-10') }>
                        <img width="17" src="/images/dashboard/icons/calendar-blue.svg"/>
                      </span>
                      <span style={ S('relative t-1 font-16') }>
                        { due_date_area }
                      </span>
                    </div>
                    <div style={ S('absolute l-230 t-4n w-300 color-929292 font-12') } className="pull-left">
                      <span>
                        <img style={ S('w-34 h-34') } src="/images/dashboard/icons/invite-user.svg"/>
                      </span>
                      <span>
                        Share this task with others
                      </span>
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
            showShareContactsModal={ this.showShareContactsModal }
          />
          <Modal show={ data.show_contacts_modal } onHide={ this.hideModal.bind(this) }>
            <Modal.Header closeButton style={ S('h-45 bc-f3f3f3') }>
             <Modal.Title style={ S('font-14') }>Share Task <span style={ S('color-929292 fw-400') }>(use any email or any phone number)</span></Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <AddContactsForm
                module_type="share-task"
                data={ data }
                hideModal={ this.hideAddContactModal }
                setContactActive={ this.setContactActive }
                setFilteredContacts={ this.setFilteredContacts }
                hideContactsForm={ this.hideContactsForm }
                addContact={ this.addContact }
                removeContact={ this.removeContact }
                showContactModal={ this.showContactModal }
                createContact={ this.createContact }
                showNewContentInitials={ this.showNewContentInitials }
              />
            </Modal.Body>
            <Modal.Footer style={ { border: 'none' } }>
              <Button bsStyle="link" onClick={ this.hideModal.bind(this) }>Cancel</Button>
              <Button onClick={ this.addContactsToTask.bind(this) } style={ S('h-30 pt-5 pl-30 pr-30') } className={ data.adding_contacts ? 'disabled' : '' } type="submit" bsStyle="primary">
                { data.adding_contacts ? 'Saving...' : 'Save' }
              </Button>
            </Modal.Footer>
          </Modal>
        </main>
      </div>
    )
  }
}

// PropTypes
Tasks.propTypes = {
  data: React.PropTypes.object
}