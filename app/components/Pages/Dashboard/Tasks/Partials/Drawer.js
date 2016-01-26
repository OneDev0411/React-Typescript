// Dashboard/Tasks/Drawer.js
import React, { Component } from 'react'
import S from 'shorti'
import { Button } from 'react-bootstrap'

// Partials
import CheckBox from './CheckBox'
import ProfileImage from '../../Partials/ProfileImage'

// Helpers
import helpers from '../../../../../utils/helpers'

export default class Drawer extends Component {

  render() {
    const data = this.props.data
    const current_task = data.current_task
    let contacts
    if (current_task)
      contacts = current_task.contacts
    let drawer
    if (current_task)
      drawer = current_task.drawer
    const drawer_height = window.innerHeight - 70
    const bottomLine = { borderBottom: '1px solid #edf1f3' }
    const topLine = { borderTop: '1px solid #edf1f3' }
    let drawer_wrap_style = {
      ...S('absolute h-' + drawer_height + ' r-0 w-0 t-70'),
      overflow: 'hidden'
    }
    const drawer_style = {
      ...S('absolute h-' + drawer_height + ' z-100 bg-fcfbf9 w-500'),
      borderLeft: '6px solid #edf1f3'
    }
    let drawer_class
    if (current_task && current_task.drawer_active)
      drawer_class = 'active'
    if (drawer) {
      drawer_wrap_style = {
        ...drawer_wrap_style,
        ...S('w-500')
      }
    }
    let title_style = S('fw-500 font-18 bg-f5fafe p-15 h-90')
    title_style = {
      ...title_style,
      ...bottomLine
    }
    let task_title
    if (current_task)
      task_title = current_task.title
    // If Done
    let text_style
    if (current_task && current_task.status === 'Done') {
      text_style = {
        ...text_style,
        textDecoration: 'line-through'
      }
    }
    let due_date_area
    let created_area
    if (current_task && current_task.due_date) {
      const due_date = current_task.due_date
      const due_date_obj = helpers.friendlyDate(due_date / 1000)
      due_date_area = (
        <span>{ `${due_date_obj.day}, ${due_date_obj.month} ${due_date_obj.date}, ${due_date_obj.year}` }</span>
      )
      const created_date = current_task.created_at
      const created_date_obj = helpers.friendlyDate(created_date)
      created_area = (
        <span>
          Created by { data.user.first_name } { data.user.last_name } on { created_date_obj.month } { created_date_obj.date }, { created_date_obj.year }
        </span>
      )
    }
    // Contacts
    let contacts_markup
    if (contacts) {
      contacts_markup = (
        contacts.map(contact => {
          return (
            <div style={ { ...S('relative p-15 w-100p bg-fff'), ...bottomLine } } className="pull-left" key={ 'added-contact-' + contact.id }>
              <div style={ S('l-0 t-12 l-10 absolute') }>
                <ProfileImage top={11} size={40} user={ contact }/>
              </div>
              <div style={ S('ml-50') }>
                <div onClick={ this.props.removeContactFromTask.bind(this, contact) } className="close pull-right" style={ S('pointer mt-5') }>&times;</div>
                <div>{ contact.first_name } { contact.last_name }</div>
                <div style={ S('color-a3a9ac font-12') }>{ contact.email }</div>
              </div>
            </div>
          )
        })
      )
    }
    return (
      <div style={ drawer_wrap_style }>
        <div style={ drawer_style } className={ 'drawer ' + drawer_class }>
          <div onClick={ this.props.closeDrawer } style={ S('mt-5 mr-15 fw-400 font-32 relative z-3') }className="close pull-right">&times;</div>
          <div style={ title_style }>
            <div style={ S('relative t-3') }>
              <CheckBox
                task={ current_task }
                editTaskStatus= { this.props.editTaskStatus }
              />
            </div>
            <span style={ text_style }>{ task_title }</span>
          </div>
          <div style={ { ...S('pt-20 p-15 h-60 mb-30 bg-fff'), ...bottomLine } }>
            <span style={ S('mr-15') }>
              <img width="17" src="/images/dashboard/icons/calendar-red.svg"/>
            </span>
            <span style={ S('color-e0523e') }>Due on { due_date_area }</span>
          </div>
          <div style={ { ...S('mb-30'), ...topLine } }>
            <div style={ { ...S('h-54 p-10 bg-fff'), ...bottomLine } }>
              <div style={ S('p-10 pull-left color-a3a9ac font-12') }>
                <span style={ S('mr-15') }><img src="/images/dashboard/icons/tasks/contacts.svg"/></span>
                Share this task with others
              </div>
              <Button onClick={ this.props.showShareTaskModal.bind(this, 'edit') } style={ S('color-006aff w-72 h-30 p-5 mt-3 bc-3388ff') } className="pull-right" bsStyle="default">Share</Button>
              <div className="clearfix"></div>
            </div>
            { contacts_markup }
            <div className="clearfix"></div>
          </div>
          <div className="clearfix"></div>
          <div style={ { ...S('p-10 h-54 color-a3a9ac font-12 bg-fff'), ...bottomLine, ...topLine } }>
            <div className="pull-left" style={ S('p-10') }>
              <span style={ S('mr-15') }><img src="/images/dashboard/icons/tasks/transactions.svg"/></span>
              Add a Transaction
            </div>
            <Button onClick={ this.props.showAddTransactionModal.bind(this) } style={ S('color-006aff w-72 h-30 p-5 mt-3 bc-3388ff') } className="pull-right" bsStyle="default">Add</Button>
          </div>
          <div style={ { ...S('b-0 absolute p-20 color-cfd1d2 font-12 w-100p'), ...topLine } }>
            { created_area }
            <div style={ S('pull-right') }>
              <span style={ S('pointer mr-20') }><img src="/images/dashboard/icons/clock.svg"/></span>
              <span onClick={ this.props.deleteTask.bind(this, current_task) } style={ S('pointer') }><img src="/images/dashboard/icons/trash.svg"/></span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

// PropTypes
Drawer.propTypes = {
  data: React.PropTypes.object,
  closeDrawer: React.PropTypes.func,
  editTaskStatus: React.PropTypes.func,
  deleteTask: React.PropTypes.func,
  showShareTaskModal: React.PropTypes.func,
  removeContactFromTask: React.PropTypes.func,
  showAddTransactionModal: React.PropTypes.func
}