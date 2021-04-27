import { useState } from 'react'
import { Button, makeStyles, createStyles, Theme } from '@material-ui/core'
import { mdiFolderPlusOutline } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

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
      flexGrow: 1,
      backgroundColor: '#fff',
      height: theme.spacing(8),
      borderBottomLeftRadius: theme.shape.borderRadius,
      borderBottomRightRadius: theme.shape.borderRadius
    },
    button: {
      justifyContent: 'flex-start',
      height: '100%',
      borderRadius: 0
    },
    buttonIcon: {
      margin: theme.spacing(0, 1.5, 0, 0.5)
    }
  })
)

export default function NewTaskRow(props: Props) {
  const [showCreateTaskDrawer, setShowCreateTaskDrawer] = useState(false)
  const classes = useStyles()
  const toggleCreateTaskDrawer = () =>
    setShowCreateTaskDrawer(!showCreateTaskDrawer)

  return (
    <div className={classes.root}>
      <Button
        fullWidth
        color="secondary"
        className={classes.button}
        onClick={toggleCreateTaskDrawer}
      >
        <SvgIcon path={mdiFolderPlusOutline} className={classes.buttonIcon} />
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
