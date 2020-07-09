import React from 'react'
import Flex from 'styled-flex-component'

import { Status } from '../Status'
import { Title, Description } from './styled'

export function GeneralInfo(props) {
  const { task } = props
  const { description } = task

  return (
    <Flex data-test="crm-task-item-general-info">
      <Status
        disabled={props.disabled}
        checked={task.status === 'DONE'}
        onClick={props.statusHandler}
      />
      <Flex column style={{ width: 'calc(100% - 2.5rem)' }}>
        <Title
          className="u-cursor--pointer"
          onClick={props.onEdit}
          style={{ margin: description ? '0 0 0.5em' : 0 }}
          truncate
        >
          {task.title}
        </Title>
        {description && (
          <Description dangerouslySetInnerHTML={{ __html: description }} />
        )}
      </Flex>
    </Flex>
  )
}
