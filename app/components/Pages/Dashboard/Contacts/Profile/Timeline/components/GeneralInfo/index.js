import React from 'react'
import Flex from 'styled-flex-component'

import { Status } from '../Status'
import { Title, Description } from './styled'

export function GeneralInfo(props) {
  const { task } = props

  return (
    <Flex style={{ marginBottom: '2em' }}>
      <Status
        disabled={props.disabled}
        checked={task.status === 'DONE'}
        onClick={props.statusHandler}
      />
      <Flex column style={{ width: 'calc(100% - 40px)' }}>
        <Title truncate className="u-cursor--pointer" onClick={props.onEdit}>
          {task.title}
        </Title>
        {task.description && <Description>{task.description}</Description>}
      </Flex>
    </Flex>
  )
}
