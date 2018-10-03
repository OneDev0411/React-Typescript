import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Field } from 'react-final-form'

import { grey } from '../../../../utils/colors'

const Input = styled.input`
  width: ${props => (props.fullWidth ? '100%' : 'calc(100% - 20px)')};
  padding: 0;
  border-width: 0;
  font-size: 1.5rem;
  font-weight: 500;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: ${grey.A550};
  }
`

Title.propTypes = {
  fullWidth: PropTypes.bool,
  placeholder: PropTypes.string,
  style: PropTypes.shape()
}

Title.defaultProps = {
  fullWidth: true,
  placeholder: 'Add a descriptive title…',
  style: {}
}

export function Title(props) {
  return (
    <Field
      name="title"
      render={({ input }) => (
        <Input
          {...input}
          type="text"
          autoComplete="off"
          style={props.style}
          placeholder={props.placeholder}
        />
      )}
    />
  )
}
