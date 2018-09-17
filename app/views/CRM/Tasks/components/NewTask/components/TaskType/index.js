import React from 'react'
import { Field } from 'react-final-form'
import Flex from 'styled-flex-component'

import { Dropdown } from '../../../../../../components/Dropdown'
import LinkButton from '../../../../../../components/Button/LinkButton'
import { eventTypesIcons } from '../../../../../../utils/event-types-icons'
import ArrowDropDown from '../../../../../../components/SvgIcons/KeyboardArrowDown/IconKeyboardArrowDown'
import { grey, primary } from '../../../../../../utils/colors'

export const Button = LinkButton.extend`
  min-width: 160px;
  font-weight: 500;
  justify-content: space-between;
  background-color: ${grey.A150};
  color: ${({ isOpen }) => (isOpen ? primary : '#000')};

  :hover {
    > svg {
      fill: ${primary};
    }
  }
`

export const Icon = ArrowDropDown.extend`
  position: relative;
  margin-left: 1em;
  transform: ${({ isOpen }) => (isOpen ? 'rotateX(180deg)' : 'none')};
`

const ITEMS = [
  {
    title: 'Call',
    value: 'Call'
  },
  {
    title: 'In Person Meeting',
    value: 'In Person Meeting'
  },
  {
    title: 'Text',
    value: 'Text'
  },
  {
    title: 'Mail',
    value: 'Mail'
  },
  {
    title: 'Social',
    value: 'Social'
  },
  {
    title: 'Email',
    value: 'Email'
  },
  {
    title: 'Other',
    value: 'Other'
  }
]

export function TaskType() {
  return (
    <Field
      name="task_type"
      render={({ input }) => (
        <Dropdown
          input={input}
          icons={eventTypesIcons}
          items={ITEMS}
          fullHeight
          buttonRenderer={props => (
            <Button {...props}>
              <Flex alignCenter>
                {props.icon && (
                  <props.icon
                    style={{ marginRight: '0.5em', fill: props.iconColor }}
                  />
                )}
                {props.value}
              </Flex>
              <Icon isOpen={props.isOpen} />
            </Button>
          )}
        />
      )}
    />
  )
}
