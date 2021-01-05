import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'

import { Tooltip } from '@material-ui/core'

import { Dropdown } from '../../Dropdown'
import { Container, Label, LabelNote, ErrorMessage } from '../styled'
import { Item } from '../../Dropdown/Item'

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
          <Container fullWidth={props.fullWidth}>
            <Label required={props.required}>
              <span>{props.label}</span>
              {props.labelNote && !props.required && (
                <LabelNote>{props.labelNote}</LabelNote>
              )}
            </Label>
            <Dropdown
              data-test={props.name}
              noBorder
              fullWidth={props.fullWidth}
              input={input}
              items={items}
              style={{ margin: 0 }}
              buttonStyle={{ padding: 0 }}
              itemRenderer={(props, item) => (
                <Tooltip title={item.hint} placement="left" key={item.value}>
                  <Item
                    {...props}
                    data-test={`${input.name}-select-option-${item.value}`}
                  >
                    {item.title}
                  </Item>
                </Tooltip>
              )}
            />
            {hasError && <ErrorMessage>{error}</ErrorMessage>}
          </Container>
        )
      }}
    />
  )
}
