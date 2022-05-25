import React, { useState, useRef, useEffect } from 'react'

import { Popover } from '@material-ui/core'
import { PopoverActions } from '@material-ui/core/Popover'
import { useDispatch } from 'react-redux'

import { useActiveBrandSettings } from '@app/hooks/brand/use-active-brand-settings'
import { setSelectedTask } from 'actions/deals'
import { DropdownToggleButton } from 'components/DropdownToggleButton'

import Form from './Create'
import List from './List'

interface Props {
  deal: IDeal
  style?: React.CSSProperties
}

function YardSign({ deal, style }: Props) {
  const popoverActions = useRef<PopoverActions | null>(null)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [showForm, setShowForm] = useState<boolean>(false)
  const dispatch = useDispatch()

  const { enable_yard_sign_requests: showYardSign } =
    useActiveBrandSettings(true)

  useEffect(() => {
    if (popoverActions.current) {
      popoverActions.current.updatePosition()
    }
  }, [showForm])

  if (!showYardSign) {
    return null
  }

  const toggleMenu = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null = null
  ) => {
    if (anchorEl) {
      setAnchorEl(null)
      setShowForm(false)

      return
    }

    if (event) {
      setAnchorEl(event.currentTarget)
    }
  }

  const onCreateTask = (task: IDealTask): void => {
    toggleMenu()
    dispatch(setSelectedTask(task))
  }

  const handleSelectItem = (task: IDealTask): void => {
    dispatch(setSelectedTask(task))
  }

  return (
    <>
      <DropdownToggleButton
        isActive={Boolean(anchorEl)}
        variant="outlined"
        size="small"
        style={style}
        onClick={toggleMenu}
      >
        Yard Sign
      </DropdownToggleButton>

      <Popover
        id={anchorEl ? 'yardsign-popover' : undefined}
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
          <Form deal={deal} onCreateTask={onCreateTask} />
        ) : (
          <List
            deal={deal}
            onSelectItem={handleSelectItem}
            onClickNewItem={() => setShowForm(true)}
          />
        )}
      </Popover>
    </>
  )
}

export default YardSign
