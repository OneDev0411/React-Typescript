import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Field } from 'react-final-form'

import { grey } from '../../../../utils/colors'

const TextArea = styled.textarea`
  width: 100%;
  height: 4rem;
  margin-bottom: 2rem;
  display: block;
  padding: 0 0 0 2.5rem;
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

Description.propTypes = {
  placeholder: PropTypes.string
}

Description.defaultProps = {
  placeholder: 'Add a descriptive title…'
}

export function Description(props) {
  return (
    <Field
      name="description"
      render={({ input }) => (
        <TextArea {...input} placeholder={props.placeholder} />
      )}
    />
  )
}
