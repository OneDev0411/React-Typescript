// Dashboard/Tasks/index.js
import React, { Component } from 'react'
import S from 'shorti'
import { Input } from 'react-bootstrap'

// Partials
import Header from '../Partials/Header'
import SideBar from '../Partials/SideBar'
import Loading from '../../../Partials/Loading'
import TasksList from './Partials/TasksList'

// AppDispatcher
import AppDispatcher from '../../../../dispatcher/AppDispatcher'

// AppStore
import AppStore from '../../../../stores/AppStore'

export default class Tasks extends Component {

  componentDidMount() {
    const data = this.props.data
    if (!data.tasks)
      this.getTasks()
    setTimeout(() => {
      this.refs.task_title.refs.input.focus()
    }, 100)
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

  handleSubmit(e) {
    e.preventDefault()
    const data = this.props.data
    const user = data.user
    const title = this.refs.task_title.refs.input.value.trim()
    this.refs.task_title.refs.input.value = ''
    AppDispatcher.dispatch({
      action: 'create-task',
      user,
      title
    })
  }

  render() {
    const data = this.props.data
    const main_style = S('absolute l-183 r-0')
    let main_content = <Loading />
    if (data.getting_tasks)
      main_content = <Loading />
    else {
      main_content = (
        <TasksList
          data={ data }
          editTaskStatus={ this.editTaskStatus }
          deleteTask={ this.deleteTask }
        />
      )
    }
    return (
      <div style={ S('minw-1000') }>
        <Header data={ data }/>
        <main style={ S('pt-20') }>
          <SideBar data={ data }/>
          <div style={ main_style }>
            <div style={ S('ml-15') }>
              <form style={ S('mr-15') } onSubmit={ this.handleSubmit.bind(this) }>
                <Input ref="task_title" type="text" placeholder="Type your task then press enter"/>
              </form>
              { main_content }
            </div>
          </div>
        </main>
      </div>
    )
  }
}

// PropTypes
Tasks.propTypes = {
  data: React.PropTypes.object
}