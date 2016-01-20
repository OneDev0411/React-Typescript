// Dashboard/Tasks/index.js
import React, { Component } from 'react'
import S from 'shorti'

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
        />
      )
    }
    return (
      <div style={ S('minw-1000') }>
        <Header data={ data }/>
        <main style={ S('pt-20') }>
          <SideBar data={ data }/>
          <div style={ main_style }>
            <div style={ S('ml-20') }>
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