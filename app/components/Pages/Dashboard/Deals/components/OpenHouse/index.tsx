import React, { useContext, useState, useRef, useEffect } from 'react'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router'

import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'

import { Popover, createStyles, makeStyles, Theme } from '@material-ui/core'
import { PopoverActions } from '@material-ui/core/Popover'

import ConfirmationModalContext from 'components/ConfirmationModal/context'

import { createTaskComment } from 'deals/utils/create-task-comment'
import { setSelectedTask, updateTask } from 'actions/deals'

import { DropdownToggleButton } from 'components/DropdownToggleButton'

import { IAppState } from 'reducers'
import { getDealChecklists } from 'reducers/deals/checklists'

import { getActiveTeamId } from 'utils/user-teams'

import OpenHouseIcon from 'components/SvgIcons/OpenHouseOutline/IconOpenHouseOutline'

import { useIconStyles } from 'views/../styles/use-icon-styles'

import { getSizeDependentStyles } from 'components/Button/ActionButton'

import List from './List'
import Form from './Form'

interface DispatchProps {
  setSelectedTask(task: IDealTask): void
  updateTask: IAsyncActionProp<typeof updateTask>
}

interface StateProps {
  user: IUser
  activeTeamId: UUID | null
  checklists: IDealChecklist[]
}

interface Props {
  deal: IDeal
  defaultOpen: boolean
  style: React.CSSProperties
}

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    button: {
      ...getSizeDependentStyles({}),
      lineHeight: 'inherit',
      borderColor: theme.palette.common.black
    }
  })
})

function OpenHouses({
  user,
  activeTeamId,
  deal,
  style,
  location,
  checklists,
  defaultOpen = false,
  updateTask,
  setSelectedTask
}: Props & StateProps & DispatchProps & RouteComponentProps<any, {}>) {
  const classes = useStyles()
  const iconClasses = useIconStyles()

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
    toggleMenu()

    if (location.state && location.state.autoBookOpenHouse) {
      location.state = {}
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
        updateTask(task.id, { title: 'Delete Open House' })

        createTaskComment(task, user.id, text)
        setSelectedTask(task)
      }
    })
  }

  return (
    <>
      <DropdownToggleButton
        ref={actionButtonRef}
        isActive={Boolean(anchorEl)}
        variant="outlined"
        color="secondary"
        size="small"
        className={classes.button}
        style={style}
        disabled={checklists.length === 0}
        onClick={toggleMenu}
      >
        <OpenHouseIcon className={iconClasses.rightMargin} /> Open House
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
          style={{ zIndex: 10 }}
        >
          {showForm ? (
            <Form
              deal={deal}
              task={selectedItem}
              autoBookOpenHouse={
                location.state && location.state.autoBookOpenHouse === true
              }
              defaultStartTime={location.state && location.state.startTime}
              defaultEndTime={location.state && location.state.endTime}
              onUpsertTask={handleUpsertTask}
            />
          ) : (
            <List
              deal={deal}
              activeTeamId={activeTeamId}
              onClickNewItem={() => setShowForm(true)}
              onSelectItem={setSelectedTask}
              onClickEdit={handleClickEdit}
              onClickDelete={handleDelete}
            />
          )}
        </Popover>
      )}
    </>
  )
}

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
  return {
    updateTask: (...args: Parameters<typeof updateTask>) =>
      dispatch(updateTask(...args)),
    setSelectedTask: (...args: Parameters<typeof setSelectedTask>) =>
      dispatch(setSelectedTask(...args))
  }
}

function mapStateToProps(
  { deals, user }: IAppState,
  ownProps: Props
): StateProps {
  return {
    user,
    activeTeamId: getActiveTeamId(user),
    checklists: getDealChecklists(ownProps.deal, deals.checklists)
  }
}

export default connect<StateProps, DispatchProps, Props>(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(OpenHouses))
