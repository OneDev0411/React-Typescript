import React from 'react'
import PropTypes from 'prop-types'
import { FieldArray } from 'react-final-form-arrays'
import { useTheme } from '@material-ui/core/styles'
import { mdiPlusCircleOutline, mdiMinusCircleOutline } from '@mdi/js'

import { TextField } from '../TextField'
import IconButton from '../../Button/IconButton'
import { SvgIcon } from '../../SvgIcons/SvgIcon'

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
  const theme = useTheme()

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
                right: '0em'
              }}
            >
              {index + 1 === fields.length ? (
                <IconButton
                  iconSize="large"
                  isFit
                  onClick={() => fields.push('')}
                  type="button"
                >
                  <SvgIcon
                    color={theme.palette.primary.main}
                    path={mdiPlusCircleOutline}
                  />
                </IconButton>
              ) : (
                <IconButton
                  iconSize="large"
                  isFit
                  onClick={() => fields.remove(index)}
                  type="button"
                >
                  <SvgIcon
                    color={theme.palette.primary.main}
                    path={mdiMinusCircleOutline}
                  />
                </IconButton>
              )}
            </div>
          </div>
        ))
      }
    </FieldArray>
  )
}
