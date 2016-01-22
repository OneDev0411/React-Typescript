// Dashboard/Tasks/Drawer.js
import React, { Component } from 'react'
import S from 'shorti'
import { Button } from 'react-bootstrap'

// Partials
import CheckBox from './CheckBox'

// Helpers
import helpers from '../../../../../utils/helpers'

export default class Drawer extends Component {

  render() {
    const data = this.props.data
    const current_task = data.current_task
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
    if (current_task && current_task.due_date) {
      const due_date = current_task.due_date
      const due_date_obj = helpers.friendlyDate(due_date / 1000)
      due_date_area = (
        <span>{ `${due_date_obj.day}, ${due_date_obj.month} ${due_date_obj.date}, ${due_date_obj.year}` }</span>
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
          <div style={ { ...S('pt-20 p-15 h-90'), ...bottomLine } }>
            <span style={ S('mr-15') }>
              <img width="17" src="/images/dashboard/icons/calendar-red.svg"/>
            </span>
            <span style={ S('color-e0523e') }>Due on { due_date_area }</span>
          </div>
          <div style={ { ...S('p-10 h-54 color-a3a9ac font-12 bg-fff mb-30'), ...bottomLine } }>
            <div className="pull-left" style={ S('p-10') }>Share this task with others</div>
            <Button style={ S('bg-fff color-006aff w-72') } className="pull-right" bsStyle="primary">Share</Button>
          </div>
          <div style={ { ...S('p-10 h-54 color-a3a9ac font-12 bg-fff'), ...bottomLine, ...topLine } }>
            <div className="pull-left" style={ S('p-10') }>Add a Transaction</div>
            <Button style={ S('bg-fff color-006aff w-72') } className="pull-right" bsStyle="primary">Add</Button>
          </div>
          <div style={ { ...S('b-0 absolute p-20 color-cfd1d2 font-12 w-100p'), ...topLine } }>
            Created by Mark Koepsell on Jan 26, 2015
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
  editTaskStatus: React.PropTypes.func
}