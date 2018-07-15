import React from 'react'
import { connect } from 'react-redux'
import timeago from 'timeago.js'
import fecha from 'fecha'

import { updateTask } from '../../../../../../store_actions/tasks'

import CircleCheckButton from '../../../../../components/Button/CircleCheckButton'
import IconButton from '../../../../../components/Button/IconButton'
import ArrowRightIcon from '../../../../../components/SvgIcons/KeyboardArrowRight/IconKeyboardArrowRight'

const OpenTaskButton = IconButton.extend`
  position: absolute;
  top: 50%;
  right: 1em;
  transform: translateY(-50%);
`

class Task extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      disabled: false,
      isDone: props.task.status === 'DONE'
    }
  }

  handleStatus = async checked => {
    const { task, updateTask } = this.props
    const newTask = {
      ...task,
      status: checked ? 'DONE' : 'PENDING'
    }

    this.setState({
      disabled: true
    })

    try {
      await updateTask(newTask)
    } catch (error) {
      throw error
    } finally {
      this.setState(({ isDone }) => ({
        isDone: !isDone,
        disabled: false
      }))
    }
  }

  render() {
    const { task } = this.props
    const { disabled, isDone } = this.state
    const { title, task_type, due_date } = task
    let dueTime = due_date * 1000

    dueTime =
      dueTime - Date.parse(new Date()) >= 0
        ? fecha.format(dueTime, 'MMM Do, YYYY hh:mm A')
        : `${timeago().format(new Date(dueTime))} passed.`

    const formatedDueTime = `Due Date: ${dueTime}`

    return (
      <div
        className={`c-tasks-timeline__item ${disabled ? 'is-disabled' : ''}`}
      >
        <CircleCheckButton
          checked={isDone}
          style={{ marginRight: '16px' }}
          onClick={() => this.handleStatus(!isDone)}
        />
        <div className="c-tasks-timeline__item__info">
          <h4
            className="c-tasks-timeline__item__title"
            style={{ textDecoration: isDone ? 'line-through' : 'initial' }}
          >
            {title}
          </h4>
          <div>
            {[task_type, formatedDueTime].filter(i => i).map((item, index) => (
              <span
                key={`task_detail_${index}`}
                className="c-tasks-timeline__item__detail"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
        <OpenTaskButton
          size="32px"
          color="#cecece"
          hoverColor="#2196f3"
          onClick={() => this.props.onClick(task)}
        >
          <ArrowRightIcon style={{ width: 32, height: 32 }} />
        </OpenTaskButton>
      </div>
    )
  }
}

export default connect(
  null,
  { updateTask }
)(Task)
