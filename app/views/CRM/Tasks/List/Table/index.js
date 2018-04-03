import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import ReactTable from 'react-table'

// eslint-disable-next-line
import Style from './Style/index.scss'

import Loading from '../../../../components/Spinner'
import FlexContainer from '../../../../components/FlexContainer'

import { updateTask, deleteTask } from '../../../../../store_actions/tasks'
import { confirmation } from '../../../../../store_actions/confirmation'

import NoTasks from './NoTasks'
import { ColumnHeader } from './get-header'
import {
  TitleCell,
  DueDateCell,
  AssociatedWithCell,
  TypeCell,
  More
} from './columns'

const Container = FlexContainer.extend`
  background: #f0f4f7;
`

class TasksListTable extends Component {
  state = {
    pageSize: 10,
    disabledTask: null
  }

  handleStatus = async (event, task) => {
    event.stopPropagation()

    const { updateTask } = this.props
    const newTask = {
      ...task,
      status: task.status !== 'DONE' ? 'DONE' : 'PENDING'
    }

    this.setState({
      disabledTask: task.id
    })

    try {
      await updateTask(newTask)
    } catch (error) {
      throw error
    } finally {
      this.setState({
        disabledTask: null
      })
    }
  }

  handleDeleteTask = async taskId => {
    this.setState({ disabledTask: taskId })
    await this.props.deleteTask(taskId)
    this.setState({ disabledTask: null })
  }

  handleOnDelete = (event, taskId) => {
    event.stopPropagation()

    this.props.confirmation({
      show: true,
      confirmLabel: 'Delete',
      message: 'Delete Task',
      onConfirm: () => this.handleDeleteTask(taskId),
      description: 'Are you sure you want to delete this task?'
    })
  }

  handleOnPageSizeChange = pageSize => {
    this.setState({
      pageSize
    })
  }

  columns = () => [
    {
      id: 'title',
      accessor: task => task.title,
      Header: <ColumnHeader title="TITLE" />,
      Cell: ({ original }) => (
        <TitleCell task={original} handleStatus={this.handleStatus} />
      )
    },
    {
      id: 'due_date',
      maxWidth: 300,
      accessor: task => task.due_date,
      Header: <ColumnHeader title="DUE DATE" />,
      Cell: ({ original }) => <DueDateCell task={original} />
    },
    {
      sortable: false,
      maxWidth: 300,
      Header: () => 'ASSOCIATED WITH',
      Cell: ({ original }) => <AssociatedWithCell task={original} />
    },
    {
      id: 'task_type',
      maxWidth: 200,
      accessor: task => task.task_type,
      Header: <ColumnHeader title="TYPE" />,
      Cell: ({ original }) => <TypeCell type={original.task_type} />
    },
    {
      Header: '',
      width: 32 + 24, // 2 x 16px padding + icon width
      sortable: false,
      className: 'td--dropdown-container',
      Cell: ({ original }) => (
        <More id={original.id} onDelete={this.handleOnDelete} />
      )
    }
  ]

  render() {
    const { pageSize } = this.state
    const { isFetching, tasks } = this.props
    const tasksCount = tasks.length
    const defaultPageSize = 10

    if (isFetching && tasksCount === 0) {
      return (
        <Container fullHeight center>
          <Loading />
        </Container>
      )
    }

    if (tasksCount === 0) {
      return (
        <Container fullHeight center>
          <NoTasks />
        </Container>
      )
    }

    return (
      <ReactTable
        minRows={0}
        columns={this.columns()}
        data={Object.values(tasks)}
        className="tasks-list-table"
        pageSize={pageSize}
        defaultPageSize={defaultPageSize}
        pageSizeOptions={[10, 20, 25, 50, 100]}
        showPaginationBottom
        showPagination={defaultPageSize < tasksCount}
        onPageSizeChange={this.handleOnPageSizeChange}
        getTrProps={(state, props) => {
          const { disabledTask } = this.state
          const task = (props && props.original) || {}

          if (disabledTask === task.id) {
            return {
              style: {
                opacity: 0.5,
                ponterEvents: 'none'
              }
            }
          }

          return {
            onClick: () => browserHistory.push(`/crm/tasks/${task.id}`)
          }
        }}
      />
    )
  }
}

export default connect(null, { updateTask, deleteTask, confirmation })(
  TasksListTable
)
