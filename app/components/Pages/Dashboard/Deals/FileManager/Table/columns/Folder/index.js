import React, { Fragment } from 'react'
import { connect } from 'react-redux'

import Loader from 'components/SvgIcons/BubblesSpinner/IconBubblesSpinner'
import { TextMiddleTruncate } from 'components/TextMiddleTruncate'

import { moveTaskFile } from 'actions/deals'

import TasksDropDown from '../../../../components/TasksDropdown'

class Folder extends React.Component {
  state = {
    isUpdating: false
  }

  onSelectTask = async (file, taskId = null, notifyOffice = false) => {
    const task = taskId ? this.props.tasks[taskId] : null

    if (file.taskId === taskId) {
      return false
    }

    try {
      this.setState({
        isUpdating: true
      })

      await this.props.moveTaskFile(
        this.props.user,
        this.props.deal.id,
        task,
        file,
        notifyOffice
      )

      this.setState({
        isUpdating: false
      })
    } catch (e) {
      console.log(e)
    }
  }

  get Task() {
    return this.props.file.task && this.props.tasks[this.props.file.task.id]
  }

  get ChecklistName() {
    return this.Task ? this.props.checklists[this.Task.checklist].title : null
  }

  render() {
    if (this.props.file.envelope) {
      return (
        <TextMiddleTruncate text={this.props.file.task.title} maxLength={50} />
      )
    }

    if (this.state.isUpdating) {
      return <Loader />
    }

    return (
      <Fragment>
        <TasksDropDown
          showStashOption={this.Task !== null}
          subTitle={this.ChecklistName}
          searchable
          pullRight
          showNotifyOption
          deal={this.props.deal}
          onSelectTask={(taskId, notifyOffice) =>
            this.onSelectTask(this.props.file, taskId, notifyOffice)
          }
          selectedTask={this.Task}
          stashOptionText="Move it to my Files"
        />
      </Fragment>
    )
  }
}

function mapStateToProps({ deals, user }) {
  return {
    user,
    tasks: deals.tasks,
    checklists: deals.checklists
  }
}

export default connect(
  mapStateToProps,
  {
    moveTaskFile
  }
)(Folder)
