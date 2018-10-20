import React, { Fragment } from 'react'
import { Field } from 'react-final-form'

import { RadioContainer, RadioLabel } from './styled'
import IconSelectedRadio from '../../SvgIcons/Radio/SelectedRadio/IconSelectedRadio'
import IconUnSelectedRadio from '../../SvgIcons/Radio/UnSelectedRadio/IconUnSelectedRadio'

export const RadioGroup = ({ name, selectedValue, options }) => (
  <RadioContainer>
    {options.map((option, index) => (
      <Fragment key={index}>
        <Field
          type="radio"
          name={name}
          render={({ input, ...rest }) => (
            <React.Fragment>
              {selectedValue === option.name ? (
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
  </RadioContainer>
)
