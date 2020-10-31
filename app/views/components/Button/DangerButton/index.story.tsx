import React, { ComponentProps } from 'react'
import { Story, Meta } from '@storybook/react'

import { DangerButton } from '.'

export default {
  title: 'Elements/DangerButton',
  component: DangerButton,
  argTypes: { onClick: { action: 'clicked' } }
} as Meta

const Template: Story<ComponentProps<typeof DangerButton>> = args => (
  <DangerButton {...args} />
)

export const Small = Template.bind({})

Small.args = {
  size: 'small',
  children: 'Button'
}

export const Medium = Template.bind({})

Medium.args = {
  size: 'medium',
  children: 'Button'
}

export const Large = Template.bind({})

Large.args = {
  size: 'large',
  children: 'Button'
}
