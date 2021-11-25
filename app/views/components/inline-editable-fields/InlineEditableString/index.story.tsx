import React, { ComponentProps } from 'react'

import { Story, Meta } from '@storybook/react'

import { InlineEditableString } from '.'

export default {
  title: 'Elements/InlineEditableString',
  component: InlineEditableString,
  argTypes: { onClick: { action: 'clicked' } }
} as Meta

const Template: Story<ComponentProps<typeof InlineEditableString>> = args => (
  <InlineEditableString {...args} onSave={() => {}} />
)

export const ViewMode = Template.bind({})

ViewMode.args = {
  value: 'Hello, World!'
}
