// Dashboard/Tasks/Partials/MainContent.js
import React, { Component } from 'react'
import S from 'shorti'
import { Button, Input, Modal } from 'react-bootstrap'
import DayPicker, { DateUtils } from 'react-day-picker'

// Partials
import TasksList from './TasksList'
import Drawer from './Drawer'
import Loading from '../../../../../Partials/Loading'
import Transaction from './Transaction'
import ProfileImage from '../../../Partials/ProfileImage'
import DayTimePicker from './DayTimePicker'

// Modules
import AddContactsModule from '../../AddContacts'

// Helpers
import helpers from '../../../../../../utils/helpers'

export default class MainContent extends Component {

  componentDidMount() {
    const data = this.props.data
    if (data.location.pathname === '/dashboard/tasks') {
      setTimeout(() => {
        this.refs.task_title.refs.input.focus()
      }, 100)
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
      } else {
        const title = this.refs.task_title.refs.input.value.trim()
        if (title) {
          this.refs.task_title.refs.input.value = ''
          this.refs.task_title.refs.input.focus()
          this.props.createTask(title)
        }
      }
    }
    // Up / down nav searched contacts
    if (data.search_contacts && data.search_contacts.list) {
      if (key === 38)
        this.props.setContactActive('up')
      if (key === 40)
        this.props.setContactActive('down')
    }
  }

  addContactFromSearch(contact) {
    const text_input = this.refs.task_title.refs.input
    const task_title = text_input.value
    const search_arr = task_title.split('@')
    let contact_name = `${contact.email}`
    if (contact.first_name && !contact.last_name)
      contact_name = `${contact.first_name}`
    if (!contact.first_name && contact.last_name)
      contact_name = `${contact.last_name}`
    if (contact.first_name && contact.last_name)
      contact_name = `${contact.first_name} ${contact.last_name}`
    text_input.value = `${search_arr[0]}${contact_name} `
    this.props.addContactFromSearch(contact)
    setTimeout(() => {
      this.refs.task_title.refs.input.focus()
    }, 300)
  }

  handleAddTaskKeyUp() {
    // Check for @
    const text_input = this.refs.task_title.refs.input
    const task_title = text_input.value
    if (task_title.indexOf('@') !== -1) {
      // Split after @
      const search_arr = task_title.split('@')
      const search_text = search_arr[1]
      this.props.searchContacts(text_input, search_text)
    } else
      this.props.removeSearchContacts()
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
          editTaskStatus={ this.props.editTaskStatus.bind(this) }
          deleteTask={ this.props.deleteTask.bind(this) }
          handleTaskClick={ this.props.handleTaskClick.bind(this) }
          module_type={ this.props.module_type }
        />
      )
    }
    let date = new Date()
    let day_picker
    if (data.show_day_picker) {
      let date_seconds = date.getTime() / 1000
      if (new_task) {
        if (new_task.due_date && typeof new_task.due_date.getTime === 'function')
          date_seconds = new_task.due_date.getTime() / 1000
        else
          date_seconds = new_task.due_date / 1000
      }
      day_picker = (
        <div style={ S('absolute t-105') }>
          <DayTimePicker
            date_seconds={ date_seconds }
            hideDayPicker={ this.props.hideDayPicker }
            handleSetDate={ this.props.setTaskDate }
            handleSaveDateTime={ this.props.setTaskDateTime }
          />
        </div>
      )
    }
    const today = helpers.friendlyDate(date.getTime() / 1000)
    let due_date_area = (
      <span>Today { `${today.day}, ${today.month} ${today.date}, ${today.year}` }</span>
    )
    if (data.new_task && data.new_task.due_date) {
      date = new Date(data.new_task.due_date)
      const due_date_obj = helpers.friendlyDate(date.getTime() / 1000)
      const hour = due_date_obj.hour
      let current_suffix = 'AM'
      let current_hour = hour
      if (hour === 0) {
        current_hour = 12
        current_suffix = 'AM'
      }
      if (hour > 12) {
        current_hour = parseInt(current_hour, 10) - 12
        current_suffix = 'PM'
      }
      if (hour === 12)
        current_suffix = 'PM'
      due_date_area = (
        <span>{ `${due_date_obj.day}, ${due_date_obj.month} ${due_date_obj.date}, ${due_date_obj.year}, ${current_hour}:${due_date_obj.min < 10 ? '0' + due_date_obj.min : due_date_obj.min}${current_suffix}` }</span>
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
            { contact.first_name ? contact.first_name : contact.email }{ i !== new_task_contacts.length - 1 ? ',' : ''}
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
          <div onClick={ this.props.addTransactionToTask.bind(this, transaction) } className="search-transaction__list-item" style={ transaction_style } key={ 'transaction-' + transaction.id }>
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
                <ProfileImage data={ data } user={ contact }/>
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
    const snooze_btn_style = S('bc-3388ff color-3388ff')
    let hour_btn_style = snooze_btn_style
    let tomorrow_btn_style = snooze_btn_style
    let date_btn_style = snooze_btn_style
    let snooze_day_picker
    let snooze_date
    let snooze_seconds
    const active_style = S('color-fff bc-3388ff bg-3388ff')
    if (data.current_task && data.current_task.snooze) {
      if (data.current_task.snooze.option === 'hour')
        hour_btn_style = active_style
      if (data.current_task.snooze.option === 'tomorrow')
        tomorrow_btn_style = active_style
      if (data.current_task.snooze.option === 'date') {
        snooze_date = data.current_task.snooze.date_selected
        if (snooze_date)
          snooze_seconds = snooze_date.getTime() / 1000
        date_btn_style = active_style
        if (!data.current_task.snooze.date_selected) {
          snooze_day_picker = (
            <div className="daypicker--tasks" style={ S('absolute bg-fff l-187 w-220 br-3 center-block') }>
              <DayPicker
                modifiers={{
                  selected: day => DateUtils.isSameDay(snooze_date, day)
                }}
                onDayClick={ this.props.setSnoozeDate.bind(this) }
              />
            </div>
          )
        }
      }
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
                  <div className="pull-left" style={ S('color-3388ff') } onClick={ this.props.showDayPicker.bind(this, 'create') }>
                    <span style={ S('mr-10') }>
                      <img width="17" src="/images/dashboard/icons/calendar-blue.svg"/>
                    </span>
                    <span style={ S('relative t-1 font-16') }>
                      { due_date_area }
                    </span>
                  </div>
                  <div onClick={ this.props.showShareTaskModal.bind(this, 'new') } style={ S('absolute l-230 t-4n w-300 color-929292 font-12') } className="pull-left">
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
          module_type={ module_type }
          closeDrawer={ this.props.closeDrawer.bind(this) }
          editTaskStatus={ this.props.editTaskStatus.bind(this) }
          deleteTask={ this.props.deleteTask.bind(this) }
          showShareTaskModal={ this.props.showShareTaskModal.bind(this) }
          removeContactFromTask={ this.props.removeContactFromTask.bind(this) }
          showAddTransactionModal={ this.props.showAddTransactionModal.bind(this) }
          containing_body_height={ this.props.containing_body_height }
          editTaskTitle={ this.props.editTaskTitle.bind(this) }
          showDayPicker={ this.props.showDayPicker.bind(this, 'edit') }
          editTaskDate={ this.props.editTaskDate }
          setEditTaskDate={ this.props.setEditTaskDate.bind(this) }
          hideDayPicker={ this.props.hideDayPicker.bind(this) }
          showSnoozeModal={ this.props.showSnoozeModal.bind(this) }
        />
        <Modal show={ data.show_contacts_modal } onHide={ this.props.hideModal }>
          <Modal.Header closeButton style={ S('h-45 bc-f3f3f3') }>
           <Modal.Title style={ S('font-14') }>Share Task <span style={ S('color-929292 fw-400') }>(use any email or any phone number)</span></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <AddContactsModule
              data={ data }
              module_type="share-task"
            />
            <div className="text-center">
              <img style={ S('w-200 h-103') } src="/images/dashboard/add-contacts/people.png" />
            </div>
          </Modal.Body>
          <Modal.Footer style={ { border: 'none' } }>
            <Button bsStyle="link" onClick={ this.props.hideModal }>Cancel</Button>
            <Button onClick={ this.props.addContactsToTask.bind(this) } style={ S('pl-30 pr-30') } className={ data.adding_contacts ? 'disabled' : '' } type="submit" bsStyle="primary">
              { data.adding_contacts ? 'Saving...' : 'Save' }
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={ data.show_transactions_modal } onHide={ this.props.hideModal }>
          <Modal.Header closeButton style={ S('h-45 bc-f3f3f3') }>
           <Modal.Title style={ S('font-14') }>Add a Transaction <span style={ S('color-929292 fw-400') }>(you can assign one transaction per task)</span></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Input type="text" ref="search_transactions" placeholder="Search for a transaction" onKeyDown={ this.props.navTransactionsList.bind(this) } onKeyUp={ this.props.searchTransactions.bind(this) }/>
            { transaction_results_area }
            <div className="text-center">
              <img style={ S('w-126 h-121 mt-20 mb-20') } src="/images/dashboard/tasks/transaction.png" />
            </div>
          </Modal.Body>
        </Modal>
        <Modal show={ data.show_snooze_modal } onHide={ this.props.hideModal }>
          <Modal.Header closeButton style={ S('h-45 bc-f3f3f3') }>
           <Modal.Title style={ S('font-14') }>Snooze Task</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Button onClick={ this.props.setSnoozeOption.bind(this, 'hour') } bsStyle="default" block style={ hour_btn_style }>In an hour</Button>
            <Button onClick={ this.props.setSnoozeOption.bind(this, 'tomorrow') } bsStyle="default" block style={ tomorrow_btn_style }>Tomorrow morning</Button>
            <Button onClick={ this.props.setSnoozeOption.bind(this, 'date') } bsStyle="default" block style={ date_btn_style }>
              { !snooze_date ? 'Pick a date' : `${helpers.friendlyDate(snooze_seconds).day}, ${helpers.friendlyDate(snooze_seconds).month} ${helpers.friendlyDate(snooze_seconds).date}, ${helpers.friendlyDate(snooze_seconds).year}` }
            </Button>
            { snooze_day_picker }
          </Modal.Body>
          <Modal.Footer style={ { border: 'none' } }>
            <Button bsStyle="link" onClick={ this.props.hideModal }>Cancel</Button>
            <Button onClick={ this.props.snoozeTaskSave.bind(this) } style={ S('pl-30 pr-30') } className={ data.snoozing_task ? 'disabled' : '' } type="submit" bsStyle="primary">
              { data.snoozing_task ? 'Saving...' : 'Save' }
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

// PropTypes
MainContent.propTypes = {
  data: React.PropTypes.object,
  module_type: React.PropTypes.string,
  handleTaskClick: React.PropTypes.func,
  addTransactionToTask: React.PropTypes.func,
  closeDrawer: React.PropTypes.func,
  editTaskStatus: React.PropTypes.func,
  deleteTask: React.PropTypes.func,
  removeContactFromTask: React.PropTypes.func,
  showAddTransactionModal: React.PropTypes.func,
  containing_body_height: React.PropTypes.number,
  editTaskTitle: React.PropTypes.func,
  editTaskDate: React.PropTypes.func,
  setEditTaskDate: React.PropTypes.func,
  hideDayPicker: React.PropTypes.func,
  handleAddTaskKeyUp: React.PropTypes.func,
  handleAddTaskKeyDown: React.PropTypes.func,
  showDayPicker: React.PropTypes.func,
  showShareTaskModal: React.PropTypes.func,
  hideModal: React.PropTypes.func,
  addContactsToTask: React.PropTypes.func,
  navTransactionsList: React.PropTypes.func,
  searchTransactions: React.PropTypes.func,
  setTaskDate: React.PropTypes.func,
  setTaskDateTime: React.PropTypes.func,
  createTask: React.PropTypes.func,
  searchContacts: React.PropTypes.func,
  removeSearchContacts: React.PropTypes.func,
  setContactActive: React.PropTypes.func,
  addContactFromSearch: React.PropTypes.func,
  showSnoozeModal: React.PropTypes.func,
  snoozeTaskSave: React.PropTypes.func,
  setSnoozeDate: React.PropTypes.func,
  setSnoozeOption: React.PropTypes.func
}