import React, { useState, useRef, useEffect } from 'react'
import { connect } from 'react-redux'

import { Popover, createStyles, makeStyles, Theme } from '@material-ui/core'
import { PopoverActions } from '@material-ui/core/Popover'

import { DropdownToggleButton } from 'components/DropdownToggleButton'

import { setSelectedTask } from 'actions/deals'

import YardSignIcon from 'components/SvgIcons/YardSign/YardSignIcon'
import { useIconStyles } from 'views/../styles/use-icon-styles'

import { getSizeDependentStyles } from 'components/Button/ActionButton'

import Form from './Create'
import List from './List'

interface DispatchProps {
  setSelectedTask(task: IDealTask): void
}

interface Props {
  deal: IDeal
  style: React.CSSProperties
}

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    button: {
      // same as action-button in components/button to make it consistent with other buttons
      ...getSizeDependentStyles({}),
      lineHeight: 'inherit',
      borderColor: theme.palette.common.black
    }
  })
})

function YardSign({ deal, style, setSelectedTask }: Props & DispatchProps) {
  const popoverActions = useRef<PopoverActions | null>(null)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [showForm, setShowForm] = useState<boolean>(false)

  const classes = useStyles()
  const iconClasses = useIconStyles()

  useEffect(() => {
    if (popoverActions.current) {
      popoverActions.current.updatePosition()
    }
  }, [showForm])

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
    setSelectedTask(task)
  }

  const handleSelectItem = (task: IDealTask): void => {
    setSelectedTask(task)
  }

  return (
    <>
      <DropdownToggleButton
        isActive={Boolean(anchorEl)}
        variant="outlined"
        color="secondary"
        size="small"
        className={classes.button}
        style={style}
        onClick={toggleMenu}
      >
        <YardSignIcon className={iconClasses.rightMargin} /> Yard Sign
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
        style={{ zIndex: 10 }}
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

export default connect<null, DispatchProps, Props>(
  null,
  { setSelectedTask }
)(YardSign)
