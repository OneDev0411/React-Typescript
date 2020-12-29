import React, { useMemo } from 'react'
import { connect } from 'react-redux'

import {
  Button,
  Typography,
  createStyles,
  makeStyles,
  Theme
} from '@material-ui/core'
import fecha from 'fecha'

import { IAppState } from 'reducers/index'
import { selectUser } from 'selectors/user'

import { selectDealTasks } from 'reducers/deals/tasks'

import { Divider } from 'components/Divider'

interface StateProps {
  user: IUser
  tasks: IDealTask[]
}

interface Props {
  deal: IDeal
  onClickNewItem(): void
  onSelectItem(task: IDealTask): void
}

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    buttonLabel: {
      alignItems: 'flex-start',
      flexDirection: 'column'
    },
    date: {
      color: theme.palette.grey.A700
    }
  })
})

function List(props: Props & StateProps) {
  const classes = useStyles()

  const tasks = useMemo(() => {
    return props.tasks.filter(task => task.task_type === 'YardSign')
  }, [props.tasks])

  return (
    <>
      <Button
        fullWidth
        color="secondary"
        classes={{
          label: classes.buttonLabel
        }}
        onClick={props.onClickNewItem}
      >
        New Yard Sign Request
      </Button>
      <Divider />

      {tasks.map(task => (
        <div key={task.id}>
          <Button
            fullWidth
            color="secondary"
            size="large"
            classes={{
              label: classes.buttonLabel
            }}
            onClick={() => props.onSelectItem(task)}
          >
            <Typography variant="body1">{task.title}</Typography>
            <Typography variant="body1" className={classes.date}>
              {fecha.format(
                new Date(task.created_at * 1000),
                'dddd, MMMM D, YYYY - hh:mmA'
              )}
            </Typography>
          </Button>
        </div>
      ))}
    </>
  )
}

function mapStateToProps(state: IAppState, ownProps: Props): StateProps {
  return {
    user: selectUser(state),
    tasks: selectDealTasks(
      ownProps.deal,
      state.deals.checklists,
      state.deals.tasks
    )
  }
}

export default connect(mapStateToProps)(List)
