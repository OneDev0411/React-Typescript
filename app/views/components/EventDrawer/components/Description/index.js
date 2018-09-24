import React from 'react'
import styled from 'styled-components'
import { Field } from 'react-final-form'

import { grey } from '../../../../utils/colors'

const TextArea = styled.textarea`
  width: 100%;
  height: 150px;
  display: block;
  padding: 0;
  border: none;
  resize: none;
  overflow: auto;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: ${grey.A550};
  }
`

export function Description() {
  return (
    <Field
      name="description"
      render={props => (
        <TextArea
          {...props.input}
          placeholder="Add a description about this event"
          style={{ marginBottom: '2em' }}
        />
      )}
    />
  )
}
