import React from 'react'
import Flex from 'styled-flex-component'

import { Status } from '../Status'
import { Title, Description } from './styled'

export function GeneralInfo(props) {
  const { task } = props
  const { description } = task

  const hasAssociation =
    task.contacts.length + task.deals.length + task.listings.length > 1

  return (
    <Flex style={{ marginBottom: hasAssociation ? '2em' : 0 }}>
      <Status
        disabled={props.disabled}
        checked={task.status === 'DONE'}
        onClick={props.statusHandler}
      />
      <Flex column>
        <Title
          className="u-cursor--pointer"
          onClick={props.onEdit}
          style={{ margin: description ? '0 0 0.5em' : 0 }}
          truncate
        >
          {task.title}
        </Title>
        {description && <Description>{description}</Description>}
      </Flex>
    </Flex>
  )
}
