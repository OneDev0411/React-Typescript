import React from 'react'

import { connect } from 'react-redux'

import IconAdd from 'components/SvgIcons/AddCircleOutline/IconAddCircleOutline'
import { selectChecklistTasks } from 'reducers/deals/tasks'

import CreateTask from '../CreateTask'

import { Item } from './Item'
import { Container, Header, Title, NewChecklistItem } from './styled'

class Checklist extends React.Component {
  state = {
    showCreateNewTask: false
  }

  toggleShowCreateTask = () =>
    this.setState(state => ({
      showCreateNewTask: !state.showCreateNewTask
    }))

  getSearchFilter = text =>
    text.toLowerCase().includes(this.props.filter.toLowerCase())

  render() {
    return (
      <Container>
        <Header>
          <Title>{this.props.checklist.title}</Title>

          <NewChecklistItem onClick={this.toggleShowCreateTask}>
            <IconAdd />
            Add Checklist Item
          </NewChecklistItem>
        </Header>

        {this.state.showCreateNewTask && (
          <CreateTask
            deal={this.props.deal}
            checklist={this.props.checklist}
            onSave={this.props.handleCreateNewTask}
            onClose={this.toggleShowCreateTask}
          />
        )}

        {this.props.tasks
          .filter(
            task =>
              this.getSearchFilter(task.title) === true &&
              ['Media', 'Splitter'].includes(task.task_type) === false
          )
          .sort((a, b) => a.order - b.order)
          .map((task, index) => (
            <Item
              key={`task${index}`}
              deal={this.props.deal}
              type="task"
              id={task.id}
              title={task.title}
              checklist={this.props.checklist}
              onToggleNotifyOffice={this.props.onToggleNotifyOffice}
              onSelectItem={this.props.onSelectItem}
            />
          ))}

        {(this.props.checklist.allowed_forms || [])
          .filter(form => {
            const isFormExists = this.props.tasks.find(
              task => task.form === form.id
            )

            return !isFormExists && this.getSearchFilter(form.name) === true
          })
          .map((form, index) => (
            <Item
              key={`form${index}`}
              deal={this.props.deal}
              type="form"
              id={form.id}
              title={form.name}
              checklist={this.props.checklist}
              onToggleNotifyOffice={this.props.onToggleNotifyOffice}
              onSelectItem={this.props.onSelectItem}
            />
          ))}
      </Container>
    )
  }
}

function mapStateToProps({ deals }, props) {
  return {
    tasks: selectChecklistTasks(props.checklist, deals.tasks)
  }
}

export default connect(mapStateToProps)(Checklist)
