import React from 'react'
import PropTypes from 'prop-types'
import { FieldArray } from 'react-final-form-arrays'

import { TextField } from '../TextField'
import IconButton from '../../Button/IconButton'
import AddIcon from '../../SvgIcons/AddCircleOutline/IconAddCircleOutline'
import RemoveIcon from '../../SvgIcons/RemoveCircleOutline/IconRemoveCircleOutline'

TextFieldArray.propTypes = {
  format: PropTypes.func,
  parse: PropTypes.func,
  placeholder: PropTypes.string,
  validate: PropTypes.func
}

TextFieldArray.defaultProps = {
  placeholder: '',
  format: t => t,
  parse: t => t,
  validate: () => undefined
}

export function TextFieldArray(props) {
  return (
    <FieldArray name={props.name}>
      {({ fields }) =>
        fields.map((field, index) => (
          <div key={field} style={{ position: 'relative' }}>
            <TextField
              format={props.format}
              label={props.label}
              name={field}
              parse={props.parse}
              placeholder={props.placeholder}
              validate={props.validate}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '0.5em',
                right: '0.5em'
              }}
            >
              {index + 1 === fields.length ? (
                <IconButton
                  type="button"
                  color="#2196f3"
                  onClick={() => fields.push('')}
                >
                  <AddIcon />
                </IconButton>
              ) : (
                <IconButton
                  type="button"
                  color="#2196f3"
                  onClick={() => fields.remove(index)}
                >
                  <RemoveIcon />
                </IconButton>
              )}
            </div>
          </div>
        ))
      }
    </FieldArray>
  )
}
