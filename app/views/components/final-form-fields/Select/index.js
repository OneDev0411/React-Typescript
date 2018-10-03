import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'

import { Dropdown } from '../../Dropdown'
import { Container, Label, LabelNote, ErrorMessage } from '../styled'
import { BasicDropdown } from '../../BasicDropdown'

Select.propTypes = {
  format: PropTypes.func,
  fullWidth: PropTypes.bool,
  hasEmptyItem: PropTypes.bool,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    }).isRequired
  ).isRequired,
  label: PropTypes.string.isRequired,
  labelNote: PropTypes.string,
  name: PropTypes.string.isRequired,
  parse: PropTypes.func,
  required: PropTypes.bool,
  validate: PropTypes.func
}

Select.defaultProps = {
  format: t => t,
  fullWidth: true,
  hasEmptyItem: true,
  labelNote: '',
  parse: t => t,
  required: false,
  validate: () => undefined
}

export function Select(props) {
  let items = props.items

  if (props.hasEmptyItem) {
    items = [{ title: '-Select-', value: '-Select-' }, ...props.items]
  }

  return (
    <Field
      name={props.name}
      format={props.format}
      parse={props.parse}
      validate={props.validate}
      render={({ input, meta }) => {
        const { error, touched } = meta
        const hasError = error && touched

        return (
          <Container>
            <Label required={props.required}>
              <span>{props.label}</span>
              {props.labelNote &&
                !props.required && <LabelNote>{props.labelNote}</LabelNote>}
            </Label>
            <Dropdown
              noBorder
              fullWidth={props.fullWidth}
              input={input}
              items={items}
              style={{ margin: 0 }}
              buttonStyle={{ padding: 0 }}
            />
            {hasError && <ErrorMessage>{error}</ErrorMessage>}
          </Container>
        )
      }}
    />
  )
}
