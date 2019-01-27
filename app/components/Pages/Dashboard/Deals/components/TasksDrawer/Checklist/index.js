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
            checklist={this.props.checklist}
            onSave={this.props.handleCreateNewTask}
            onClose={this.toggleShowCreateTask}
          />
        )}

        {this.props.tasks
          .filter(task => this.getSearchFilter(task.title) === true)
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .map((task, index) => (
            <Item
              key={`task${index}`}
              type="task"
              id={task.id}
              title={task.title}
              selectedItem={this.props.selectedItem}
              notifyOffice={this.props.notifyOffice}
              checklist={this.props.checklist}
              onToggleNotifyOffice={this.props.onToggleNotifyOffice}
              onSelectItem={this.props.onSelectItem}
            />
          ))}

        {this.props.checklist.allowed_forms
          .filter(form => {
            const isFormExists = this.props.tasks.find(
              task => task.form === form.id
            )

            return !isFormExists && this.getSearchFilter(form.name) === true
          })
          .map((form, index) => (
            <Item
              key={`form${index}`}
              type="form"
              id={form.id}
              title={form.name}
              selectedItem={this.props.selectedItem}
              notifyOffice={this.props.notifyOffice}
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
