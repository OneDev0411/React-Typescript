import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Flex from 'styled-flex-component'

import { addNotification as notify } from 'components/notification'

import OverlayDrawer from 'components/OverlayDrawer'

import {
  createFormTask,
  changeNeedsAttention,
  setExpandChecklist,
  moveTaskFile
} from 'actions/deals'

import { getDealChecklists } from 'reducers/deals/checklists'
import { selectTaskById } from 'reducers/deals/tasks'
import { selectFormById } from 'reducers/deals/forms'

import Search from 'components/Grid/Search'
import Spinner from 'components/Spinner'
import { H4 } from 'components/Typography/headings'

import Checklist from './Checklist'

const initialState = {
  isSaving: false,
  searchFilter: ''
}

class TasksDrawer extends React.Component {
  state = initialState

  handleSearch = searchFilter =>
    this.setState({
      searchFilter
    })

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

      this.handleMoveFile({
        type: 'task',
        id: task.id,
        checklistId,
        notifyOffice
      })
    } catch (e) {
      this.setState({
        isSaving: false
      })
    }
  }

  handleMoveFile = async selectedItem => {
    this.setState({
      isSaving: true
    })

    try {
      let task

      if (selectedItem.type === 'task') {
        task = selectTaskById(this.props.tasks, selectedItem.id)
      } else {
        const form = selectFormById(
          this.props.forms,
          this.props.deal.id,
          selectedItem.id
        )

        task = await this.props.createFormTask(
          this.props.deal.id,
          form.id,
          form.name,
          selectedItem.checklistId
        )
      }

      const newFile = await this.props.moveTaskFile(
        this.props.user,
        this.props.deal,
        task,
        this.props.file,
        selectedItem.notifyOffice
      )

      // expand checklist if is close
      this.props.setExpandChecklist(task.checklist, true)

      this.props.onMoveComplete(task, newFile)
    } catch (e) {
      console.log(e)
    }

    this.setState({
      isSaving: false
    })

    this.handleClose()
  }

  handleClose = () => {
    this.setState(initialState)
    this.props.onClose()
  }

  render() {
    return (
      <OverlayDrawer
        {...this.props.drawerOptions}
        open={this.props.isOpen}
        onClose={this.handleClose}
      >
        <OverlayDrawer.Header title={this.props.title} />
        <OverlayDrawer.Body>
          {this.state.isSaving === false ? (
            <Fragment>
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
                    onSelectItem={this.handleMoveFile}
                    handleCreateNewTask={this.handleCreateNewTask}
                  />
                ))}
            </Fragment>
          ) : (
            <Flex justifyCenter alignCenter column style={{ height: '80vh' }}>
              <Spinner />
              <H4>Moving file, please wait...</H4>
            </Flex>
          )}
        </OverlayDrawer.Body>
      </OverlayDrawer>
    )
  }
}

TasksDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  deal: PropTypes.object.isRequired,
  file: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onMoveComplete: PropTypes.func,
  drawerOptions: PropTypes.object
}

TasksDrawer.defaultProps = {
  onMoveComplete: () => null,
  drawerOptions: {}
}

function mapStateToProps({ deals, user }, props) {
  return {
    user,
    forms: deals.forms,
    tasks: deals.tasks,
    checklists: getDealChecklists(props.deal, deals.checklists)
  }
}

export default connect(mapStateToProps, {
  createFormTask,
  changeNeedsAttention,
  moveTaskFile,
  setExpandChecklist,
  notify
})(TasksDrawer)
