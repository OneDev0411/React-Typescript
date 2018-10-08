import React, { Fragment } from 'react'

import IconButton from 'components/Button/IconButton'
import CloseIcon from 'components/SvgIcons/Close/CloseIcon'
import EditIcon from 'components/SvgIcons/Edit/EditIcon'

import TaskStatus from '../../Checklists/TaskRow/Status'

import {
  Toolbar,
  StatusContainer,
  Actions,
  TitleContainer,
  Title
} from './styled'

export default function Header({ task, deal, onClose }) {
  if (!task) {
    return false
  }

  return (
    <Fragment>
      <Toolbar>
        <StatusContainer>
          <TaskStatus task={task} isDraftDeal={deal.is_draft} />
        </StatusContainer>

        <Actions>
          <IconButton
            type="button"
            isFit
            iconSize="large"
            inverse
            onClick={onClose}
          >
            <EditIcon />
          </IconButton>

          <IconButton
            type="button"
            isFit
            iconSize="large"
            inverse
            style={{
              marginLeft: '1.5rem'
            }}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        </Actions>
      </Toolbar>

      <TitleContainer>
        <Title>{task.title}</Title>
      </TitleContainer>
    </Fragment>
  )
}
