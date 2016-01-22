// Dashboard/Tasks/index.js
import React, { Component } from 'react'
import S from 'shorti'
import { Input } from 'react-bootstrap'
import DayPicker from 'react-day-picker'

// Helpers
import helpers from '../../../../utils/helpers'

// Partials
import Header from '../Partials/Header'
import SideBar from '../Partials/SideBar'
import Loading from '../../../Partials/Loading'
import TasksList from './Partials/TasksList'
import Drawer from './Partials/Drawer'

// AppDispatcher
import AppDispatcher from '../../../../dispatcher/AppDispatcher'

// AppStore
import AppStore from '../../../../stores/AppStore'

export default class Tasks extends Component {

  componentDidMount() {
    const data = this.props.data
    if (!data.tasks)
      this.getTasks()
    AppStore.emitChange()
    setTimeout(() => {
      this.refs.task_title.refs.input.focus()
    }, 100)
    // Esc to close
    document.onkeydown = evt => {
      if (evt.keyCode === 27 && data.current_task)
        this.closeDrawer()
    }
  }

  getTasks() {
    const data = this.props.data
    const user = data.user
    AppStore.data.getting_tasks = true
    AppStore.emitChange()
    AppDispatcher.dispatch({
      action: 'get-tasks',
      user
    })
  }

  editTaskStatus(task, status) {
    const data = this.props.data
    const user = data.user
    AppDispatcher.dispatch({
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
    AppDispatcher.dispatch({
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
        AppDispatcher.dispatch({
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