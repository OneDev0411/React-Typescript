import React from 'react'

import { MetaInfo } from '../components/MetaInfo'
import { Assignees } from '../components/Assignees'
import { GeneralInfo } from '../components/GeneralInfo'
import { Associations } from '../components/Associations'

import { CRMTaskItem } from '../CRMTaskItem'

export function EventItem(props) {
  const { task } = props

  return (
    <CRMTaskItem
      {...props}
      render={({ onEdit, statusHandler, disabled }) => (
        <React.Fragment>
          <MetaInfo task={task} onEdit={onEdit} />
          <GeneralInfo
            disabled={disabled}
            onEdit={onEdit}
            statusHandler={statusHandler}
            task={task}
          />
          <Associations task={task} user={props.user} contact={props.contact} />
          <Assignees task={task} />
        </React.Fragment>
      )}
    />
  )
}
