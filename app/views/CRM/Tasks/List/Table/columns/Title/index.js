import React from 'react'

import { TruncateText } from '../../../../../../components/TruncateText'
import FlexContainer from '../../../../../../components/FlexContainer'
import CircleCheckButton from '../../../../../../components/Button/CircleCheckButton'

const Title = TruncateText('h3').extend`
  margin: 0;
  line-height: 1;
  font-size: 1.6rem;
  color: #1d364b;
  text-decoration: ${props => (props.done ? 'line-through' : 'none')};
  `

const Note = TruncateText('div').extend`
  margin: 0;
  line-height: 1;
  color: #8da2b5;
  text-decoration: ${props => (props.done ? 'line-through' : 'none')};
`

export function TitleCell({ task, handleStatus }) {
  const { status, title, description } = task
  const done = status === 'DONE'

  return (
    <FlexContainer>
      <CircleCheckButton
        checked={done}
        style={{ marginRight: '16px' }}
        onClick={event => handleStatus(event, task)}
      />
      <div style={{ overflow: 'hidden' }}>
        <Title done={done} style={{ marginBottom: description ? '0.5em' : 0 }}>
          {title}
        </Title>
        {description && <Note done={done}>{description}</Note>}
      </div>
    </FlexContainer>
  )
}
