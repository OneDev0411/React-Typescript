import React from 'react'
import PropTypes from 'prop-types'

import { Field } from 'react-final-form'
import Flex from 'styled-flex-component'

import RadioButton from 'components/RadioButton'

import { InputLabel, InputRequired } from '../styled'

RadioGroup.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      name: PropTypes.string
    }).isRequired
  ).isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  styles: PropTypes.object,
  isRequired: PropTypes.bool,
  hasLabel: PropTypes.bool,
  showError: PropTypes.bool
}

RadioGroup.defaultProps = {
  styles: {},
  label: '',
  hasLabel: true,
  isRequired: false,
  showError: true
}

export function RadioGroup(props) {
  return (
    <Flex column flexStart>
      {props.hasLabel && (
        <InputLabel>
          {props.label} <InputRequired>{props.isRequired && '*'}</InputRequired>
        </InputLabel>
      )}

      <Flex alignCenter style={{ height: '2rem' }}>
        {props.options.map((option, index) => (
          <Field
            key={index}
            style={{ marginRight: '1rem' }}
            type="radio"
            name={props.name}
            render={({ input, ...rest }) => (
              <RadioButton
                caption={option.label}
                selected={props.selectedValue === option.name}
                onClick={() => input.onChange(option.name)}
                {...input}
                {...rest}
              />
            )}
          />
        ))}
      </Flex>
    </Flex>
  )
}
