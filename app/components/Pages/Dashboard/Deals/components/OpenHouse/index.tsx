import React, { useState, useRef, useEffect } from 'react'
import { connect } from 'react-redux'

import { Popover, createStyles, makeStyles, Theme } from '@material-ui/core'
import { PopoverActions } from '@material-ui/core/Popover'

import { setSelectedTask } from 'actions/deals'

import { DropdownToggleButton } from 'components/DropdownToggleButton'

import { IAppState } from 'reducers'

import { getActiveTeamId } from 'utils/user-teams'

import OpenHouseIcon from 'components/SvgIcons/OpenHouseOutline/IconOpenHouseOutline'

import { useIconStyles } from 'views/../styles/use-icon-styles'

import { getStylesDependedSize } from 'components/Button/ActionButton'

import List from './List'
import Form from './Form'

interface DispatchProps {
  setSelectedTask(task: IDealTask): void
}

interface StateProps {
  activeTeamId: UUID | null
}

interface Props {
  deal: IDeal
  style: React.CSSProperties
}

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    button: {
      ...getStylesDependedSize({}),
      lineHeight: 'inherit',
      borderColor: theme.palette.common.black
    }
  })
})

function OpenHouses({
  activeTeamId,
  deal,
  style
}: Props & StateProps & DispatchProps) {
  const popoverActions = useRef<PopoverActions | null>(null)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [showForm, setShowForm] = useState<boolean>(false)
  const [selectedItem, setSelectedItem] = useState<IDealTask | null>(null)

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
    setSelectedTask(task)
  }

  return (
    <>
      <DropdownToggleButton
        isActive={false}
        variant="outlined"
        color="secondary"
        size="small"
        className={classes.button}
        style={style}
        onClick={toggleMenu}
      >
        <OpenHouseIcon className={iconClasses.rightMargin} /> Open House
      </DropdownToggleButton>
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
        style={{ zIndex: 10 }}
      >
        {showForm ? (
          <Form
            deal={deal}
            task={selectedItem}
            onUpsertTask={handleUpsertTask}
          />
        ) : (
          <List
            deal={deal}
            activeTeamId={activeTeamId}
            onSelectItem={setSelectedTask}
            onClickNewItem={() => setShowForm(true)}
          />
        )}
      </Popover>
    </>
  )
}

function mapStateToProps({ user }: IAppState): StateProps {
  return {
    activeTeamId: getActiveTeamId(user)
  }
}

export default connect<StateProps, DispatchProps, Props>(
  mapStateToProps,
  { setSelectedTask }
)(OpenHouses)
