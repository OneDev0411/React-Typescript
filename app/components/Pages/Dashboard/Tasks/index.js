// Dashboard/Tasks/index.js
import React, { Component } from 'react'
import S from 'shorti'

// Partials
import Header from '../Partials/Header'
import SideBar from '../Partials/SideBar'
import TasksModule from '../Modules/Tasks'

export default class Tasks extends Component {

  render() {
    const data = this.props.data
    return (
      <div style={S('minw-1000')}>
        <Header data={data} />
        <main style={S('pt-15')}>
          <SideBar data={data} />
          <TasksModule
            data={data}
            module_type="tasks"
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