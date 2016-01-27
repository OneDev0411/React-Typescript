// TasksModule.js
import React, { Component } from 'react'
import { Button, Input, Modal, Col, Alert } from 'react-bootstrap'
import S from 'shorti'
import validator from 'validator'
import helpers from '../../../../utils/helpers'

// Partials
import ProfileImage from './ProfileImage'

export default class TasksModule extends Component {
  render() {
    const new_task = data.new_task
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

    return (
      <div className={ 'task-list' + open_class } style={ main_style }>
        <div style={ S('ml-15') }>
          <div style={ S('mr-15 relative') }>
            <form>
              <Input onKeyDown={ this.handleAddTaskKeyDown.bind(this) } style={ { ...S('h-110 pt-12 font-18'), resize: 'none' } } ref="task_title" type="textarea" placeholder="Type your task then press enter"/>
              <div style={ S('absolute b-0 pl-15 pb-15 pointer') }>
                <div className="pull-left" style={ S('color-3388ff') } onClick={ this.showDayPicker }>
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
        showShareTaskModal={ this.showShareTaskModal }
        removeContactFromTask={ this.removeContactFromTask }
        showAddTransactionModal={ this.showAddTransactionModal.bind(this) }
      />
      <Modal show={ data.show_contacts_modal } onHide={ this.hideModal.bind(this) }>
        <Modal.Header closeButton style={ S('h-45 bc-f3f3f3') }>
         <Modal.Title style={ S('font-14') }>Share Task <span style={ S('color-929292 fw-400') }>(use any email or any phone number)</span></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddContactsModule
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
      <Modal show={ data.show_transactions_modal } onHide={ this.hideModal.bind(this) }>
        <Modal.Header closeButton style={ S('h-45 bc-f3f3f3') }>
         <Modal.Title style={ S('font-14') }>Add a Transaction <span style={ S('color-929292 fw-400') }>(you can assign one transaction per task)</span></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Input type="text" ref="search_transactions" placeholder="Search for a transaction" onKeyDown={ this.navTransactionsList.bind(this) } onKeyUp={ this.searchTransactions.bind(this) }/>
          { transaction_results_area }
        </Modal.Body>
      </Modal>
    )
  }
}