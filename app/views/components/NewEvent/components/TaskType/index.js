import React from 'react'
import styled from 'styled-components'
import { Field } from 'react-final-form'
import Flex from 'styled-flex-component'

import { mdiChevronDown } from '@mdi/js'

import { Dropdown } from 'components/Dropdown'
import LinkButton from 'components/Button/LinkButton'
import { eventTypesIcons } from 'components/../utils/event-types-icons'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { grey, primary } from 'views/utils/colors'

export const Button = styled(LinkButton)`
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
export const IconArrow = styled(SvgIcon)`
  position: relative;
  margin-left: 1em;
  fill: ${({ isOpen }) => (isOpen ? primary : '#000')};
  transform: ${({ isOpen }) => (isOpen ? 'rotateX(180deg)' : 'none')};
`

const ITEMS = [
  {
    title: 'Call',
    value: 'Call'
  },
  {
    title: 'In-Person Meeting',
    value: 'In-Person Meeting'
  },
  {
    title: 'Text',
    value: 'Text'
  },
  {
    title: 'Chat',
    value: 'Chat'
  },
  {
    title: 'Mail',
    value: 'Mail'
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
          buttonRenderer={({ icon: Icon, iconColor, ...props }) => (
            <Button {...props} inverse>
              <Flex alignCenter>
                {Icon && (
                  <Icon
                    style={{
                      marginRight: '0.5em',
                      fill: iconColor || '#000'
                    }}
                  />
                )}
                {props.value}
              </Flex>
              <IconArrow path={mdiChevronDown} isOpen={props.isOpen} />
            </Button>
          )}
        />
      )}
    />
  )
}
