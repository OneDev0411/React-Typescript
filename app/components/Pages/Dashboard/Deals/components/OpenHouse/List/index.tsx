import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import Flex from 'styled-flex-component'

import {
  Button,
  IconButton,
  Typography,
  Tooltip,
  createStyles,
  makeStyles,
  Theme
} from '@material-ui/core'

import { IAppState } from 'reducers/index'
import { selectDealTasks } from 'reducers/deals/tasks'

import { Divider } from 'components/Divider'

import IconTime from 'components/SvgIcons/Time/IconTime'
import IconDelete from 'components/SvgIcons/Trash/TrashIcon'

import { useIconStyles } from 'views/../styles/use-icon-styles'

interface StateProps {
  user: IUser
  tasks: IDealTask[]
}

interface Props {
  deal: IDeal
  activeTeamId: UUID | null
  onClickNewItem(): void
  onSelectItem(task: IDealTask): void
  onClickEdit(task: IDealTask): void
  onClickDelete(task: IDealTask): void
}

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    root: {
      '& a, & button': {
        zIndex: 1,
        position: 'relative'
      }
    },
    buttonLabel: {
      alignItems: 'flex-start',
      flexDirection: 'column'
    },
    itemContainer: {
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      padding: theme.spacing(1, 3),
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: theme.palette.action.hover
      }
    },
    date: {
      color: theme.palette.grey.A700
    },
    actions: {
      marginLeft: theme.spacing(3)
    },
    iconButton: {
      marginLeft: theme.spacing(1)
    },
    clickableArea: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      opacity: 0,
      width: '100%'
    }
  })
})

function List(props: Props & StateProps) {
  const classes = useStyles()
  const iconClasses = useIconStyles()

  const tasks = useMemo(() => {
    return props.tasks.filter(task => task.task_type === 'YardSign')
  }, [props.tasks])

  return (
    <div className={classes.root}>
      <Button
        fullWidth
        color="primary"
        size="large"
        classes={{
          label: classes.buttonLabel
        }}
        onClick={props.onClickNewItem}
      >
        Create New Open House
      </Button>
      <Divider />

      {tasks.map(task => (
        <div key={task.id}>
          <div className={classes.itemContainer}>
            <Typography variant="body1">
              <Flex justifyBetween>
                <Flex>{task.title}</Flex>

                <Flex className={classes.actions}>
                  <Tooltip title="Adjust new date and time">
                    <IconButton
                      size="small"
                      className={classes.iconButton}
                      onClick={() => props.onClickEdit(task)}
                    >
                      <IconTime className={iconClasses.small} />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Cancel Request">
                    <IconButton
                      size="small"
                      className={classes.iconButton}
                      onClick={() => props.onClickDelete(task)}
                    >
                      <IconDelete className={iconClasses.small} />
                    </IconButton>
                  </Tooltip>
                </Flex>
              </Flex>
            </Typography>

            <div
              onClick={() => props.onSelectItem(task)}
              className={classes.clickableArea}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function mapStateToProps(
  { user, deals }: IAppState,
  ownProps: Props
): StateProps {
  return {
    user,
    tasks: selectDealTasks(ownProps.deal, deals.checklists, deals.tasks)
  }
}

export default connect(mapStateToProps)(List)
