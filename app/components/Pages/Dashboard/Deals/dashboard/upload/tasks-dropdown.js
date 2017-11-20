import React from 'react'
import { connect } from 'react-redux'
import { Dropdown, MenuItem } from 'react-bootstrap'
import { setUploadAttributes } from '../../../../../../store_actions/deals'

class DropDownTasks extends React.Component {
  constructor(props) {
    super(props)
  }

  getSelectedTask() {
    const { tasks, selectedTask } = this.props
    return selectedTask ? tasks[selectedTask].title : null
  }

  render() {
    const { shouldDropUp, upload, checklists, tasks } = this.props

    return (
      <Dropdown
        id="deal-tasks-dropdown"
        dropup={shouldDropUp}
      >
        <Dropdown.Toggle className="deal-task-dropdown">
          { this.getSelectedTask() || 'Select a task' }
        </Dropdown.Toggle>

        <Dropdown.Menu className="deal-task-dropdown-list">
          {
            upload.deal.checklists.map((chId, key) => {
              const checklist = checklists[chId]
              return (
                <div key={chId}>

                  <div className="checklist">
                    { checklist.title }
                  </div>

                  {
                    checklist.tasks.map((tId, key) => {
                      const task = tasks[tId]

                      return (
                        <MenuItem
                          key={tId}
                          onClick={() => this.props.onSelectTask(tId)}
                        >
                          { task.title }
                        </MenuItem>
                      )
                    })
                  }

                  <MenuItem className="new-task">
                    Add new task to { checklist.title }
                  </MenuItem>
                </div>
              )
            })
          }
        </Dropdown.Menu>
      </Dropdown>
    )
  }
}

function mapStateToProps({ deals }) {
  return {
    upload: deals.upload,
    checklists: deals.checklists,
    tasks: deals.tasks
  }
}

export default connect(mapStateToProps, { setUploadAttributes })(DropDownTasks)
