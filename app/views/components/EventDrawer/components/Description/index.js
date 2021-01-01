import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Field } from 'react-final-form'

import TextareaAutosize from 'react-textarea-autosize'

import { grey } from '../../../../utils/colors'

const TextArea = styled(TextareaAutosize)`
  width: 100%;
  padding: ${({ theme }) => theme.spacing(1)}px;
  min-height: 6rem;
  max-height: 10rem;
  display: block;
  border: 1px solid ${({ theme }) => theme.palette.divider};
  border-radius: ${({ theme }) => theme.shape.borderRadius}px;
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
      render={({ input }) => <TextArea {...input} {...props} />}
    />
  )
}
