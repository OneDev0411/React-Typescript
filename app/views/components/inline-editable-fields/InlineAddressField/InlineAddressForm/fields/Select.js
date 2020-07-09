import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'
import { mdiChevronDown } from '@mdi/js'

import { Dropdown } from 'components/Dropdown'
import { Item } from 'components/Dropdown/Item'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { Container, Label, SelectButton } from './styled'

Select.propTypes = {
  width: PropTypes.number,
  hasEmptyItem: PropTypes.bool,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    }).isRequired
  ).isRequired
}

Select.defaultProps = {
  width: 20,
  hasEmptyItem: true
}

export function Select(props) {
  let items = props.items

  if (props.hasEmptyItem) {
    items = [{ title: 'Select', value: '' }, ...props.items]
  }

  return (
    <Field
      name={props.name}
      render={({ input }) => (
        <Container width={props.width}>
          <Label>{props.label}</Label>
          <Dropdown
            noBorder
            input={input}
            items={items}
            style={{ margin: '0 0 1.5rem' }}
            buttonRenderer={({ icon: Icon, iconColor, ...props }) => (
              <SelectButton
                {...props}
                inverse
                appearance="link"
                isActive={props.isOpen}
              >
                <span
                  style={{ width: 'calc(100% - 1.5rem)', textAlign: 'left' }}
                >
                  {props.value}
                </span>
                <SvgIcon
                  path={mdiChevronDown}
                  rotate={props.isOpen ? 180 : 0}
                />
              </SelectButton>
            )}
            itemRenderer={(props, item) => <Item {...props}>{item.title}</Item>}
          />
        </Container>
      )}
    />
  )
}
