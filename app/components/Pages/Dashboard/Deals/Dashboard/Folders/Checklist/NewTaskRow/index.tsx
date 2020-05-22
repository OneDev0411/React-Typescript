import React, { useState } from 'react'

import { Button, makeStyles, createStyles, Theme } from '@material-ui/core'
import cn from 'classnames'

import IconAdd from 'components/SvgIcons/AddCircleOutline/IconAddCircleOutline'

import { useIconStyles } from 'views/../styles/use-icon-styles'

import TaskCreate from '../../../../components/TaskCreate'

interface Props {
  deal: IDeal
  checklist: IDealChecklist | null
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing(1, 2),
      backgroundColor: theme.palette.action.hover
    }
  })
)

export default function NewTaskRow(props: Props) {
  const [showCreateTaskDrawer, setShowCreateTaskDrawer] = useState(false)
  const classes = useStyles()
  const iconClasses = useIconStyles()

  const toggleCreateTaskDrawer = () =>
    setShowCreateTaskDrawer(!showCreateTaskDrawer)

  return (
    <div className={classes.root}>
      <Button onClick={toggleCreateTaskDrawer} color="secondary">
        <IconAdd
          className={cn(iconClasses.rightMargin, iconClasses.currentColor)}
        />
        Add New Checklist Item
      </Button>

      <TaskCreate
        deal={props.deal}
        checklist={props.checklist}
        isOpen={showCreateTaskDrawer}
        onClose={toggleCreateTaskDrawer}
      />
    </div>
  )
}
