import React, { useState, useRef, useEffect } from 'react'
import { connect } from 'react-redux'

import { Popover, createStyles, makeStyles, Theme } from '@material-ui/core'
import { PopoverActions } from '@material-ui/core/Popover'

import { useFilterCRMTasks } from 'hooks/use-filter-crm-tasks'

import { OpenHouseDrawer } from 'components/open-house/OpenHouseDrawer'

import { DropdownToggleButton } from 'components/DropdownToggleButton'

import { IAppState } from 'reducers'

import { getActiveTeamId } from 'utils/user-teams'

import OpenHouseIcon from 'components/SvgIcons/OpenHouseOutline/IconOpenHouseOutline'

import { useIconStyles } from 'views/../styles/use-icon-styles'

import { getStylesDependedSize } from 'components/Button/ActionButton'

import List from './List'

type OpenHouse = ICRMTask<CRMTaskAssociation, CRMTaskAssociationType>

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
      // same as action-button in components/button to make it consistent with other buttons
      ...getStylesDependedSize({}),
      lineHeight: 'inherit',
      borderColor: theme.palette.common.black
    }
  })
})

function OpenHouses({ activeTeamId, deal, style }: Props & StateProps) {
  const popoverActions = useRef<PopoverActions | null>(null)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)
  const [selectedItem, setSelectedItem] = useState<OpenHouse | null>(null)

  const classes = useStyles()
  const iconClasses = useIconStyles()

  const { list: openHousesList, reloadList, isFetching } = useFilterCRMTasks(
    {
      order: '-due_date',
      task_type: 'Open House'
    },
    {
      isFetching: true
    }
  )

  useEffect(() => {
    if (popoverActions.current) {
      popoverActions.current.updatePosition()
    }
  }, [isDrawerOpen])

  const toggleMenu = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null = null
  ) => {
    if (anchorEl) {
      setAnchorEl(null)
      setIsDrawerOpen(false)

      return
    }

    if (event) {
      setAnchorEl(event.currentTarget)
    }
  }

  const handleDelete = () => {
    handleClose()
    reloadList()
  }

  const handleSubmit = (item: OpenHouse, action: string) => {
    console.log(item, action)
  }

  const handleSelectItem = (
    item: ICRMTask<CRMTaskAssociation, CRMTaskAssociationType>
  ): void => {
    setSelectedItem(item)
    setIsDrawerOpen(true)
  }

  const handleClose = () => {
    setSelectedItem(null)
    setIsDrawerOpen(false)
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
        <List
          deal={deal}
          list={openHousesList}
          isFetching={isFetching}
          activeTeamId={activeTeamId}
          onSelectItem={handleSelectItem}
          onClickNewItem={() => setIsDrawerOpen(true)}
        />
      </Popover>

      {isDrawerOpen && (
        // @ts-ignore js component
        <OpenHouseDrawer
          isOpen={isDrawerOpen}
          openHouse={selectedItem}
          deleteCallback={handleDelete}
          submitCallback={handleSubmit}
          onClose={handleClose}
          associations={{
            deal
          }}
        />
      )}
    </>
  )
}

function mapStateToProps({ user }: IAppState): StateProps {
  return {
    activeTeamId: getActiveTeamId(user)
  }
}

export default connect<StateProps, {}, Props>(mapStateToProps)(OpenHouses)
