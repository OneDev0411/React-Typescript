import React from 'react'
import { connect } from 'react-redux'
import { Row, Col, Button, Dropdown, MenuItem, Panel } from 'react-bootstrap'
import cn from 'classnames'
import CreateTask from '../create-task'
import TaskStatus from './status'
import TaskTermination from './termination'

class List extends React.Component {
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

  getLabel(section) {
    let color = '#8da2b5'
    let label = ''

    if (section.is_terminated) {
      label = 'Terminated'
      color = '#d0011b'
    }

    return (
      <div
        className="p-label"
        style={{ color }}
      >
        { label }
      </div>
    )
  }

  render() {
    const { showMenu } = this.state
    const {
      tasks,
      rooms,
      section,
      dealId,
      selectedTaskId,
      onSelectTask
    } = this.props

    if (!section) {
      return false
    }

    return (
      <Panel
        collapsible
        defaultExpanded
        className="section"
        header={
          <div>
            <div className="crt">
              <i
                className="fa fa-caret-down p-icon"
              />
            </div>

            <div className="info">
              <div>
                <div className="p-title">
                  { section.title }
                </div>

                { this.getLabel(section) }
              </div>
            </div>

            <div className="cta">
              <Dropdown
                id={`SECTION_CTA_${section.id}`}
                className="deal-checklist-cta-menu"
                open={showMenu}
                onToggle={() => this.toggleMenu()}
                pullRight
              >
                <Button
                  className="cta-btn btn-link"
                  bsRole="toggle"
                  onClick={e => e.stopPropagation()}
                >
                  <i className="fa fa-ellipsis-v" />
                </Button>

                <Dropdown.Menu>
                  <TaskTermination
                    dealId={dealId}
                    checklist={section}
                    onCloseDropDownMenu={() => this.toggleMenu()}
                  />

                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        }
      >
        <div className={`list ${!section.tasks ? 'empty' : ''}`}>
          {
            section.tasks &&
            section.tasks
            .map((id, key) => {
              const task = tasks[id]
              const room = rooms[task.room.id] || task.room

              return (
                <div
                  key={`TASK_${id}_${key}`}
                  onClick={() => onSelectTask(task)}
                  className={cn('task', { active: selectedTaskId === id })}
                >
                  <div className="title">
                    { task.title.replace(/&.*;/g, '') }
                  </div>

                  <TaskStatus
                    task={task}
                  />

                  <span
                    className={cn('notification', {
                      has_notification: room.new_notifications > 0
                    })}
                  >
                  </span>
                </div>
              )
            })
          }

          <CreateTask
            dealId={dealId}
            listId={section.id}
          />
        </div>
      </Panel>
    )
  }
}

export default connect(({ deals, chatroom }) => ({
  rooms: chatroom.rooms,
  tasks: deals.tasks
}))(List)

