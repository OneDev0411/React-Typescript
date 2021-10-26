import { useState } from 'react'

import {
  MenuList,
  Button,
  makeStyles,
  MenuItem,
  Theme,
  Divider,
  Typography
} from '@material-ui/core'
import { mdiPlus } from '@mdi/js'

import { BaseDropdown } from '@app/views/components/BaseDropdown'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import TaskCreate from '../../../../components/TaskCreate'

interface Props {
  deal: IDeal
  checklist: IDealChecklist | null
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      flexGrow: 1,
      height: theme.spacing(6),
      borderBottomLeftRadius: theme.shape.borderRadius,
      borderBottomRightRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.grey['50']
    },
    button: {
      justifyContent: 'flex-start',
      height: '100%',
      borderRadius: 0
    },
    buttonIcon: {
      margin: theme.spacing(0, 0.5, 0, 0.5)
    },
    menuList: {
      minWidth: '300px'
    },
    divider: {
      margin: theme.spacing(1, 0)
    }
  }),
  {
    name: 'Checklist-NewTaskRow'
  }
)

export default function NewTaskRow(props: Props) {
  const [newTaskType, setNewTaskType] = useState<Nullable<IDealTaskType>>(null)

  const classes = useStyles()
  const toggleCreateTaskDrawer = () => setNewTaskType(null)

  return (
    <div className={classes.root}>
      <BaseDropdown
        renderDropdownButton={buttonProps => (
          <Button
            fullWidth
            color="primary"
            className={classes.button}
            {...buttonProps}
          >
            <SvgIcon path={mdiPlus} className={classes.buttonIcon} />
            Add
          </Button>
        )}
        renderMenu={({ close }) => (
          <MenuList className={classes.menuList}>
            <MenuItem
              onClick={() => {
                setNewTaskType('Form')
                close()
              }}
            >
              Form{' '}
              <Typography color="textSecondary">
                &nbsp;(from library)
              </Typography>
            </MenuItem>
            <MenuItem
              onClick={() => {
                setNewTaskType('Generic')
                close()
              }}
            >
              New Folder
            </MenuItem>
            <Divider className={classes.divider} />
            <MenuItem
              onClick={() => {
                setNewTaskType('Splitter')
                close()
              }}
            >
              New Section
            </MenuItem>
          </MenuList>
        )}
      />

      <TaskCreate
        deal={props.deal}
        checklist={props.checklist}
        taskType={newTaskType}
        onClose={toggleCreateTaskDrawer}
      />
    </div>
  )
}
