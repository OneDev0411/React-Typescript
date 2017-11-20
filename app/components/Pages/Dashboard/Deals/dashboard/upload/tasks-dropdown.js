import React from 'react'
import { connect } from 'react-redux'
import { Dropdown, MenuItem } from 'react-bootstrap'

class DropDownTasks extends React.Component {
  constructor(props) {
    super(props)
  }

  getSelectedTask() {
    return null
  }

  calculateDropDownPosition() {
    console.log(this.dropdown)
  }

  render() {
    const { shouldDropUp, upload, checklists, tasks } = this.props

    return (
      <Dropdown
        id="deal-tasks-dropdown"
        dropup={shouldDropUp}
      >
        <Dropdown.Toggle
          className="deal-task-dropdown"
          onClick={() => this.calculateDropDownPosition()}
        >
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
                        <MenuItem key={tId}>
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

export default connect(mapStateToProps)(DropDownTasks)
