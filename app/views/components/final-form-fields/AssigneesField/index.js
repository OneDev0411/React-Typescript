import React from 'react'
import { Field } from 'react-final-form'

import { Assignees } from '../../TeamContact/Assignees'

class DummyAssignees extends React.Component {
  filterAssignees = id => this.props.input.value.filter(a => a.id !== id)

  onChangeHandler = ({ value: user }) => {
    const {
      input: { value: assignees }
    } = this.props

    if (assignees.some(a => a.id === user.id)) {
      return this.props.input.onChange(this.filterAssignees(user.id))
    }

    this.props.input.onChange([...assignees, user])
  }

  onRemoveHandler = id => {
    this.props.input.onChange(this.filterAssignees(id))
  }

  render() {
    return (
      <Assignees
        owner={this.props.owner}
        assignees={this.props.input.value}
        teamMembers={this.props.teamMembers}
        onChangeHandler={this.onChangeHandler}
        onRemoveHandler={this.onRemoveHandler}
      />
    )
  }
}

export function AssigneesField(props) {
  return <Field {...props} component={DummyAssignees} />
}
