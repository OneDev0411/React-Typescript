import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Field } from 'react-final-form'
import sanitizeHtml from 'sanitize-html'

import TextareaAutosize from 'react-textarea-autosize'

import { grey } from '../../../../utils/colors'

const TextArea = styled(TextareaAutosize)`
  width: 100%;
  min-height: 6rem;
  max-height: 10rem;
  display: block;
  margin-bottom: 1rem;
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
      render={({ input: { value, ...restInput } }) => {
        const sanitizedValue = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {}
        })

        return <TextArea value={sanitizedValue} {...restInput} {...props} />
      }}
    />
  )
}
