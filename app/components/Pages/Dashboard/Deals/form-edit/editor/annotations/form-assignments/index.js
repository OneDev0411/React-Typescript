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

function getAssignmentComponent({ assignment }) {
  switch (assignment) {
    case 'Initials':
      return <InitialsAssignment />

    case 'Signature':
      return <SignatureAssignment />

    case 'Date':
      return <DateAssignment />

    case 'Textbox':
      return <TextboxAssignment />

    case 'Checkbox':
      return <CheckboxAssignment />

    default:
      return null
  }
}

export default function FormAssignments(props) {
  return (
    <Fragment>
      {props.assignments.map((assignment, key) => (
        <Assignment key={key} rect={assignment.annotation.rect}>
          {getAssignmentComponent(assignment)}
        </Assignment>
      ))}
    </Fragment>
  )
}
