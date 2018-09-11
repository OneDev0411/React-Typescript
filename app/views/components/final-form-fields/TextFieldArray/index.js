import React from 'react'
import PropTypes from 'prop-types'
import { FieldArray } from 'react-final-form-arrays'

import { TextField } from '../TextField'
import IconButton from '../../Button/IconButton'
import AddIcon from '../../SvgIcons/AddCircleOutline/IconAddCircleOutline'
import RemoveIcon from '../../SvgIcons/RemoveCircleOutline/IconRemoveCircleOutline'

TextFieldArray.propTypes = {
  hint: PropTypes.string,
  format: PropTypes.func,
  labelNote: PropTypes.string,
  parse: PropTypes.func,
  placeholder: PropTypes.string,
  validate: PropTypes.func
}

TextFieldArray.defaultProps = {
  hint: '',
  format: t => t,
  labelNote: '',
  parse: t => t,
  placeholder: '',
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
              labelNote={props.labelNote}
              name={field}
              parse={props.parse}
              placeholder={props.placeholder}
              validate={props.validate}
              hint={props.hint}
            />
            <div
              style={{
                position: 'absolute',
                top: '0.5em',
                right: '0.5em'
              }}
            >
              {index + 1 === fields.length ? (
                <IconButton
                  isFit
                  iconSize="large"
                  onClick={() => fields.push('')}
                  type="button"
                >
                  <AddIcon />
                </IconButton>
              ) : (
                <IconButton
                  isFit
                  iconSize="large"
                  type="button"
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
