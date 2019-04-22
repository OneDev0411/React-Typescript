import React, { Fragment } from 'react'
import { Field } from 'react-final-form'
import Flex from 'styled-flex-component'

import IconSelectedRadio from '../../SvgIcons/Radio/SelectedRadio/IconSelectedRadio'
import IconUnSelectedRadio from '../../SvgIcons/Radio/UnSelectedRadio/IconUnSelectedRadio'

import { RadioLabel } from './styled'
import { InputLabel, InputRequired } from '../styled'

export function RadioGroup(props) {
  return (
    <Flex column>
      <Flex>
        <InputLabel>
          {props.label} <InputRequired>{props.isRequired && '*'}</InputRequired>
        </InputLabel>
      </Flex>

      <Flex>
        {props.options.map((option, index) => (
          <Fragment key={index}>
            <Field
              type="radio"
              name={props.name}
              render={({ input, ...rest }) => (
                <React.Fragment>
                  {props.selectedValue === option.name ? (
                    <IconSelectedRadio
                      onClick={() => input.onChange(option.name)}
                      {...input}
                      {...rest}
                    />
                  ) : (
                    <IconUnSelectedRadio
                      onClick={() => input.onChange(option.name)}
                      {...input}
                      {...rest}
                    />
                  )}
                </React.Fragment>
              )}
            />
            <RadioLabel>{option.label}</RadioLabel>
          </Fragment>
        ))}
      </Flex>
    </Flex>
  )
}
