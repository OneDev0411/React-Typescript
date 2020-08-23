import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Field } from 'react-final-form'
import { mdiCheck } from '@mdi/js'
import { useTheme } from '@material-ui/core/styles'

import { primary, grey } from '../../../utils/colors'
import { SvgIcon } from '../../SvgIcons/SvgIcon'

// visually hidden
const Checkbox = styled.input`
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
`

const Label = styled.label`
  position: relative;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 1em 0 0;
  border-radius: 8px;
  background-color: ${props => (props.checked ? primary : '#fff')};
  border: solid 1px ${props => (props.checked ? primary : grey.A550)};
  cursor: pointer;

  &:hover {
    background-color: ${props => (props.checked ? primary : grey.A100)};
  }
`

CheckboxField.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  size: PropTypes.number
}

CheckboxField.defaultProps = {
  size: 24
}

export function CheckboxField(props) {
  const theme = useTheme()
  const { id, size } = props

  return (
    <Field
      name={props.name}
      render={({ input }) => {
        const checked = input.value === 'DONE'

        return (
          <Label htmlFor={id} size={size} checked={checked}>
            <Checkbox
              {...input}
              id={id}
              type="checkbox"
              onChange={() => input.onChange(checked ? 'PENDING' : 'DONE')}
            />
            {checked && (
              <SvgIcon
                size={size * 0.75}
                path={mdiCheck}
                color={theme.palette.common.white}
              />
            )}
          </Label>
        )
      }}
    />
  )
}
