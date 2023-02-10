import React from 'react'

import PropTypes from 'prop-types'
import { Field } from 'react-final-form'

import { TextEditor } from 'components/TextEditor'

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
      render={({ input: { value, ...restInput } }) => (
        <TextEditor editorState={value} {...restInput} {...props} />
      )}
    />
  )
}
