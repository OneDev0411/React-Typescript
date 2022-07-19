import React, { useContext, useState, useRef, useEffect } from 'react'

import { Popover } from '@material-ui/core'
import { PopoverActions } from '@material-ui/core/Popover'
import { useSelector, useDispatch } from 'react-redux'
import { withRouter, WithRouterProps } from 'react-router'

import { useActiveBrandSettings } from '@app/hooks/brand/use-active-brand-settings'
import {
  setSelectedTask,
  updateTask,
  changeNeedsAttention
} from 'actions/deals'
import ConfirmationModalContext from 'components/ConfirmationModal/context'
import { DropdownToggleButton } from 'components/DropdownToggleButton'
import { createTaskComment } from 'deals/utils/create-task-comment'
import { IAppState } from 'reducers'
import { getDealChecklists } from 'reducers/deals/checklists'
import { selectUser } from 'selectors/user'

import Form from './Form'
import List from './List'

interface Props {
  deal: IDeal
  defaultOpen: boolean
  style?: React.CSSProperties
}

function OpenHouses({
  deal,
  style,
  location,
  router,
  defaultOpen = false
}: Props & WithRouterProps) {
  const dispatch = useDispatch()

  const user = useSelector(selectUser)
  const checklists = useSelector(({ deals }: IAppState) =>
    getDealChecklists(deal, deals.checklists)
  )

  const activeBrandSettings = useActiveBrandSettings(true)
  const { enable_open_house_requests: showOpenHouse } = activeBrandSettings

  const confirmation = useContext(ConfirmationModalContext)

  const popoverActions = useRef<PopoverActions | null>(null)
  const actionButtonRef = useRef<HTMLButtonElement | null>(null)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [showForm, setShowForm] = useState<boolean>(false)
  const [selectedItem, setSelectedItem] = useState<IDealTask | null>(null)

  useEffect(() => {
    if (popoverActions.current) {
      popoverActions.current.updatePosition()
    }
  }, [showForm])

  useEffect(() => {
    if (defaultOpen) {
      setAnchorEl(actionButtonRef.current)
      setShowForm(true)
    }
  }, [defaultOpen])

  if (!showOpenHouse) {
    return null
  }

  const toggleMenu = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null = null
  ) => {
    if (anchorEl) {
      setAnchorEl(null)
      setSelectedItem(null)
      setShowForm(false)

      return
    }

    if (event) {
      setAnchorEl(event.currentTarget)
    }
  }

  const handleUpsertTask = (task: IDealTask): void => {
    setShowForm(false)
    dispatch(setSelectedTask(task))
    toggleMenu()

    if (location.state && location.state.autoBookOpenHouse) {
      router.replace({
        ...location,
        state: {}
      })
    }
  }

  const handleClickEdit = (task: IDealTask): void => {
    setShowForm(true)
    setSelectedItem(task)
  }

  const handleDelete = (task: IDealTask): void => {
    setAnchorEl(null)

    confirmation.setConfirmationModal({
      message: 'Cancel Open House Request',
      needsUserEntry: true,
      inputDefaultValue: "I'd like to cancel this open house, please.",
      onConfirm: (text: string) => {
        dispatch(updateTask(task.id, { title: 'Delete Open House' }))
        dispatch(changeNeedsAttention(deal.id, task.id, true))

        createTaskComment(task, user.id, text)
        dispatch(setSelectedTask(task))
      }
    })
  }

  return (
    <>
      <DropdownToggleButton
        ref={actionButtonRef}
        isActive={Boolean(anchorEl)}
        variant="outlined"
        size="small"
        style={style}
        disabled={checklists.length === 0}
        onClick={toggleMenu}
      >
        Open House
      </DropdownToggleButton>

      {checklists.length > 0 && (
        <Popover
          id={anchorEl ? 'openhouse-popover' : undefined}
          action={popoverActions}
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={() => toggleMenu()}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}
        >
          {showForm ? (
            <Form
              deal={deal}
              task={selectedItem}
              autoBookOpenHouse={
                location.state && location.state.autoBookOpenHouse === true
              }
              defaultStartDate={location.state && location.state.startTime}
              defaultEndDate={location.state && location.state.endTime}
              onUpsertTask={handleUpsertTask}
            />
          ) : (
            <List
              deal={deal}
              onClickNewItem={() => setShowForm(true)}
              onSelectItem={task => dispatch(setSelectedTask(task))}
              onClickEdit={handleClickEdit}
              onClickDelete={handleDelete}
            />
          )}
        </Popover>
      )}
    </>
  )
}

export default withRouter(OpenHouses)
