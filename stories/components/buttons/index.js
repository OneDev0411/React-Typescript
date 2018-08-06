import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import ActionButton from '../../../app/views/components/Button/ActionButton'
import IconButton from '../../../app/views/components/Button/IconButton'
import CloseIcon from '../../../app/views/components/SvgIcons/Close/CloseIcon'

function Primary() {
  return <ActionButton onClick={action('clicked')}>Primary</ActionButton>
}

function Secondary() {
  return <ActionButton onClick={action('clicked')}>Secondary</ActionButton>
}

function Icon() {
  return (
    <IconButton onClick={action('clicked')}>
      <CloseIcon />
    </IconButton>
  )
}

export default () =>
  storiesOf('Buttons', module)
    .add('Primary', Primary)
    .add('Secondary', Secondary)
    .add('With Icon', Icon)
