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
    const {
      meta: { error, touched }
    } = this.props

    return (
      <div>
        <Assignees
          owner={this.props.owner}
          buttonText={this.props.buttonText}
          assignees={this.props.input.value}
          teamMembers={this.props.teamMembers}
          onChangeHandler={this.onChangeHandler}
          onRemoveHandler={this.onRemoveHandler}
        />
        {error && touched && (
          <div style={{ color: '#F43B38', marginTop: '0.5rem' }}>{error}</div>
        )}
      </div>
    )
  }
}

export function AssigneesField(props) {
  return <Field {...props} component={DummyAssignees} />
}
