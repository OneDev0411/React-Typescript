import React, { Fragment } from 'react'
import styled from 'styled-components'

import InitialsAssignment from './initials'
import SignatureAssignment from './signature'
import DateAssignment from './date'
import TextboxAssignment from './textbox'
import CheckboxAssignment from './checkbox'

const Assignment = styled.div`
  position: absolute;
  left: ${props => props.rect[0]}px;
  top: ${props => props.rect[1]}px;
  width: ${props => Math.floor(props.rect[2] - props.rect[0])}px;
  height: ${props => Math.floor(props.rect[3] - props.rect[1])}px;
`

class FormAssignments extends React.Component {
  getAssignmentComponent(assignment) {
    const { annotation } = assignment

    const color = this.props.getRoleColor(assignment)

    if (!color)
      return null

    const props = {
      height: Math.floor(annotation.rect[3] - annotation.rect[1]),
      color
    }

    switch (assignment.assignment) {
      case 'Initials':
        return <InitialsAssignment {...props} />

      case 'Signature':
        return <SignatureAssignment {...props} />

      case 'Date':
        return <DateAssignment {...props} />

      case 'Textbox':
        return <TextboxAssignment {...props} />

      case 'Checkbox':
        return <CheckboxAssignment {...props} />

      default:
        return null
    }
  }

  render() {
    return (
      <Fragment>
        {this.props.assignments.map((assignment, key) => (
          <Assignment key={key} rect={assignment.annotation.rect}>
            {this.getAssignmentComponent(assignment)}
          </Assignment>
        ))}
      </Fragment>
    )
  }
}

export default FormAssignments