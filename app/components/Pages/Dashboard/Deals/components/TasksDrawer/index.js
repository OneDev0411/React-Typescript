import React from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'

import OverlayDrawer from 'components/OverlayDrawer'
import { getChecklists } from 'reducers/deals/checklists'

import {
  createFormTask,
  changeNeedsAttention,
  moveTaskFile
} from 'actions/deals'

import Search from 'components/Grid/Search'

import ActionButton from 'components/Button/ActionButton'

import { selectTaskById } from 'reducers/deals/tasks'
import { selectFormById } from 'reducers/deals/forms'

import Checklist from './Checklist'

class TasksDrawer extends React.Component {
  state = {
    isSaving: false,
    searchFilter: '',
    selectedItem: {},
    notifyOffice: false
  }

  handleSearch = searchFilter =>
    this.setState({
      searchFilter
    })

  handleSelectItem = ({ type, id, checklistId }) => {
    this.setState({
      selectedItem: { type, id, checklistId }
    })
  }

  handleToggleNotifyOffice = ({ type, id, checklistId }) => {
    if (
      this.state.selectedItem.type === type &&
      this.state.selectedItem.id === id
    ) {
      this.setState(state => ({
        notifyOffice: !state.notifyOffice
      }))

      return
    }

    this.handleSelectItem({
      type,
      id,
      checklistId
    })

    this.setState({
      notifyOffice: true
    })
  }

  notifyOffice = (deal, task) => {
    this.props.changeNeedsAttention(deal.id, task.id, true).then(() =>
      this.props.notify({
        message: `Office has been notified for "${task.title}"`,
        status: 'success'
      })
    )
  }

  handleCreateNewTask = async (checklistId, title, notifyOffice) => {
    try {
      const task = await this.props.createFormTask(
        this.props.deal.id,
        null,
        title,
        checklistId
      )

      if (notifyOffice) {
        this.notifyOffice(this.props.deal, task)
      }

      this.handleSelectItem({
        type: 'task',
        id: task.id,
        checklistId
      })

      this.props.notify({
        message: `Task "${title}" created.`,
        status: 'success'
      })
    } catch (e) {
      this.setState({
        isSaving: false
      })

      this.props.notify({
        message: 'Could not create the task. try again.',
        status: 'error'
      })
    }
  }

  handleMoveFile = async () => {
    const { selectedItem } = this.state

    this.setState({
      isSaving: true
    })

    try {
      let task

      if (selectedItem.type === 'task') {
        task = selectTaskById(this.props.tasks, selectedItem.id)
      } else {
        const form = selectFormById(this.props.forms, selectedItem.id)

        task = await this.props.createFormTask(
          this.props.deal.id,
          form.id,
          form.name,
          selectedItem.checklistId
        )
      }

      await this.props.moveTaskFile(
        this.props.user,
        this.props.deal.id,
        task,
        this.props.file,
        this.state.notifyOffice
      )
    } catch (e) {
      console.log(e)
    }

    this.setState({
      isSaving: false
    })

    this.props.onClose()
  }

  render() {
    return (
      <OverlayDrawer isOpen={this.props.isOpen} onClose={this.props.onClose}>
        <OverlayDrawer.Header title={this.props.title} />
        <OverlayDrawer.Body>
          <Search
            style={{ margin: '1rem 0' }}
            disableOnSearch={false}
            showLoadingOnSearch
            placeholder="Search"
            onChange={this.handleSearch}
            onClearSearch={this.handleSearch}
          />

          {this.props.checklists
            .filter(checklist => !checklist.is_terminated)
            .map(checklist => (
              <Checklist
                key={checklist.id}
                checklist={checklist}
                filter={this.state.searchFilter}
                selectedItem={this.state.selectedItem}
                notifyOffice={this.state.notifyOffice}
                onSelectItem={this.handleSelectItem}
                handleCreateNewTask={this.handleCreateNewTask}
                onToggleNotifyOffice={this.handleToggleNotifyOffice}
              />
            ))}
        </OverlayDrawer.Body>

        <OverlayDrawer.Footer style={{ justifyContent: 'flex-end' }}>
          <ActionButton
            disabled={
              this.state.isSaving ||
              Object.keys(this.state.selectedItem).length === 0
            }
            onClick={this.handleMoveFile}
          >
            {this.state.isSaving ? 'Moving...' : 'Move File'}
          </ActionButton>
        </OverlayDrawer.Footer>
      </OverlayDrawer>
    )
  }
}

function mapStateToProps({ deals, user }, props) {
  return {
    user,
    forms: deals.forms,
    tasks: deals.tasks,
    checklists: getChecklists(props.deal, deals.checklists)
  }
}

export default connect(
  mapStateToProps,
  { createFormTask, changeNeedsAttention, moveTaskFile, notify }
)(TasksDrawer)
