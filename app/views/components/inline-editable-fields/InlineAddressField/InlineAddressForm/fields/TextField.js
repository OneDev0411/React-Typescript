import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'
import { mdiInformationOutline } from '@mdi/js'

import Tooltip from 'components/tooltip'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

import { Container, Label, Input, Hint } from './styled'

TextField.propTypes = {
  width: PropTypes.number,
  style: PropTypes.shape(),
  validate: PropTypes.func,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  hint: PropTypes.string
}

TextField.defaultProps = {
  style: {},
  width: 25,
  validate() {},
  hint: ''
}

export function TextField(props) {
  const id = `${props.name}_text-field`

  return (
    <Field
      name={props.name}
      validate={props.validate}
      render={({ input }) => (
        <Container width={props.width} style={props.style}>
          <Label htmlFor={id}>
            {props.label}
            {props.hint && (
              <Hint>
                <Tooltip caption={props.hint} placement="bottom">
                  <SvgIcon
                    path={mdiInformationOutline}
                    size={muiIconSizes.small}
                  />
                </Tooltip>
              </Hint>
            )}
          </Label>
          <Input
            {...input}
            id={id}
            type="text"
            autoComplete="disabled"
            placeholder={props.placeholder}
          />
        </Container>
      )}
    />
  )
}
