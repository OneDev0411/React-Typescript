import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import ActionButton from '../../../app/views/components/Button/ActionButton'
import IconButton from '../../../app/views/components/Button/IconButton'
import CloseIcon from '../../../app/views/components/SvgIcons/Close/CloseIcon'

import { WrapStory } from '../../utils/WrapStory'
import { Block } from '../../utils/Block'

function Primary() {
  return (
    <div>
      <Block>
        <ActionButton onClick={action('clicked')}>Small</ActionButton>
      </Block>
      <Block>
        <ActionButton onClick={action('clicked')} style={{ fontSize: '1rem' }}>
          Medium
        </ActionButton>
      </Block>
      <Block>
        <ActionButton
          onClick={action('clicked')}
          style={{ fontSize: '1.5rem', padding: '0.5em 2em' }}
        >
          Large
        </ActionButton>
      </Block>
    </div>
  )
}

function Secondary() {
  return (
    <div>
      <Block>
        <ActionButton inverse onClick={action('clicked')}>
          Small
        </ActionButton>
      </Block>
      <Block>
        <ActionButton
          inverse
          onClick={action('clicked')}
          style={{ fontSize: '1rem' }}
        >
          Medium
        </ActionButton>
      </Block>
      <Block>
        <ActionButton
          inverse
          onClick={action('clicked')}
          style={{ fontSize: '1.5rem', padding: '0.5em 2em' }}
        >
          Large
        </ActionButton>
      </Block>
    </div>
  )
}

function WithIcon() {
  const GhostButton = ActionButton.extend`
    &:hover svg {
      fill: #fff !important;
    }
  `

  return (
    <div>
      <Block>
        <IconButton onClick={action('clicked')}>
          <CloseIcon />
        </IconButton>
      </Block>
      <Block>
        <ActionButton onClick={action('clicked')}>
          <CloseIcon style={{ fill: '#fff' }} />
        </ActionButton>
      </Block>
      <Block>
        <GhostButton
          inverse
          onClick={action('clicked')}
          style={{ fontSize: '1rem' }}
        >
          <CloseIcon style={{ fill: '#2196f3' }} />
        </GhostButton>
      </Block>
    </div>
  )
}

export default () =>
  storiesOf('Buttons', module)
    .add('Primary', WrapStory(Primary, 'Primary Button'))
    .add('Secondary', WrapStory(Secondary, 'Secondary Button'))
    .add('With Icon', WrapStory(WithIcon, 'Button with a icon'))
