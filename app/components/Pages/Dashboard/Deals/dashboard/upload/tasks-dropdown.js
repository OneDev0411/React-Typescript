import React from 'react'
import { connect } from 'react-redux'
import { Dropdown, MenuItem, Button } from 'react-bootstrap'
import { setUploadAttributes } from '../../../../../../store_actions/deals'

class DropDownTasks extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showMenu: false
    }
  }

  toggleMenu() {
    this.setState({
      showMenu: !this.state.showMenu
    })
  }

  onSelectTask(taskId) {
    this.props.onSelectTask(taskId)
    this.toggleMenu()
  }

  render() {
    const { showMenu } = this.state
    const { shouldDropUp, selectedTask, upload, checklists, tasks } = this.props

    return (
      <Dropdown
        id="deal-tasks-dropdown"
        dropup={shouldDropUp}
        open={showMenu}
        onToggle={() => this.toggleMenu()}
      >
        <Button
          className="deal-task-dropdown"
          bsRole="toggle"
          onClick={e => e.stopPropagation()}
        >
          { (selectedTask && selectedTask.title) || 'Select a task' }
        </Button>

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
                    checklist.tasks.map((tId, key) =>
                      <li
                        key={tId}
                        onClick={() => this.onSelectTask(tId)}
                      >
                        { tasks[tId].title }
                      </li>
                    )
                  }

                  <li className="new-task">
                    Add new task to { checklist.title }
                  </li>
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
