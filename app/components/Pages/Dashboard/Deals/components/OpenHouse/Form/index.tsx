import React, { useState } from 'react'
import { connect } from 'react-redux'

import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'

import { Button, createStyles, makeStyles, Theme } from '@material-ui/core'
import DayPicker from 'react-day-picker'
import Flex from 'styled-flex-component'

import fecha from 'fecha'

import { createTaskComment } from 'deals/utils/create-task-comment'
import { createRequestTask } from 'actions/deals/helpers/create-request-task'
import { updateTask } from 'actions/deals'

import { InputLabel } from 'components/Forms/styled'

import TimeInput from 'components/TimeInput'

import { IAppState } from 'reducers'
import { getDealChecklists } from 'reducers/deals/checklists'

import { DatePickerContainer } from './styled'

interface StateProps {
  user: IUser
  checklists: IDealChecklist[]
}

interface DispatchProps {
  updateTask: IAsyncActionProp<typeof updateTask>
  createRequestTask: IAsyncActionProp<typeof createRequestTask>
}

interface Props {
  deal: IDeal
  task: IDealTask | null
  defaultStartTime: number | null
  defaultEndTime: number | null
  onUpsertTask(task: IDealTask): void
}

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    root: {
      padding: theme.spacing(2)
    },
    buttonContainer: {
      marginTop: theme.spacing(2)
    },
    fieldContainer: {
      marginTop: theme.spacing(1)
    },
    buttonLabel: {
      justifyContent: 'flex-start'
    }
  })
})

function OpenHouseForm(props: Props & StateProps & DispatchProps) {
  const classes = useStyles()

  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [startTime, setStartTime] = useState<Date | null>(
    props.defaultStartTime ? new Date(props.defaultStartTime * 1000) : null
  )
  const [endTime, setEndTime] = useState<Date | null>(
    props.defaultEndTime ? new Date(props.defaultEndTime * 1000) : null
  )

  const handleSetStartDate = (date: Date) => {
    const datetime = new Date(date)

    datetime.setHours(startTime ? startTime.getHours() : 0)
    datetime.setMinutes(startTime ? startTime.getMinutes() : 0)

    setStartTime(datetime)
  }

  const handleChangeStartTime = (date: Date) => {
    setStartTime(date)

    if (endTime && date > endTime) {
      setEndTime(date)
    }
  }

  const handleSetEndTime = (date: Date) => {
    const endTime = new Date(startTime!).setHours(
      date.getHours(),
      date.getMinutes()
    )

    if (endTime > new Date(startTime!).getTime()) {
      setEndTime(date)
    }
  }

  const setInitialEndDate = () => {
    const date = new Date(
      new Date(startTime!).setHours(startTime!.getHours() + 1)
    )

    setEndTime(date)
  }

  const handleSave = async (): Promise<void> => {
    if (!startTime) {
      return
    }

    setIsSaving(true)

    const checklist = props.checklists.find(
      checklist => checklist.checklist_type === 'Selling'
    )!

    const taskTitle = [
      fecha.format(startTime, 'dddd, MMMM D, YYYY  hh:mmA'),
      endTime ? `- ${fecha.format(endTime, 'hh:mmA')}` : ''
    ].join(' ')

    if (props.task) {
      createTaskComment(
        props.task,
        props.user.id,
        `Please change open house time to:\n ${taskTitle}`
      )

      await props.updateTask(props.task.id, {
        title: `Update Open House to ${taskTitle}`
      })

      props.onUpsertTask(props.task)

      setIsSaving(false)

      return
    }

    const task = await props.createRequestTask({
      checklist,
      userId: props.user.id,
      dealId: props.deal.id,
      taskType: 'OpenHouse',
      taskTitle: `Open House: ${taskTitle}`,
      taskComment: `Please create an open house for this date:\n${taskTitle}`,
      notifyMessage: 'Back office has been notified'
    })

    setIsSaving(false)

    if (task) {
      props.onUpsertTask(task as any)
    }
  }

  return (
    <div className={classes.root}>
      <DatePickerContainer>
        <DayPicker
          initialMonth={startTime || new Date()}
          selectedDays={startTime}
          disabledDays={{
            before: new Date()
          }}
          onDayClick={handleSetStartDate}
        />
      </DatePickerContainer>

      <div className={classes.fieldContainer}>
        <InputLabel>From</InputLabel>

        <div>
          <TimeInput
            id="start-time"
            defaultDate={getDefaultTime()}
            initialDate={startTime}
            onChange={handleChangeStartTime}
          />
        </div>
      </div>

      {startTime && (
        <div className={classes.fieldContainer}>
          {!endTime ? (
            <Button variant="text" color="primary" onClick={setInitialEndDate}>
              Add End Time
            </Button>
          ) : (
            <>
              <InputLabel>To</InputLabel>

              <Flex alignCenter justifyBetween>
                <TimeInput
                  id="end-time"
                  defaultDate={getDefaultTime()}
                  initialDate={endTime}
                  onChange={handleSetEndTime}
                />

                <Button
                  variant="text"
                  color="primary"
                  size="small"
                  onClick={() => setEndTime(null)}
                >
                  Remove End Time
                </Button>
              </Flex>
            </>
          )}
        </div>
      )}

      <div className={classes.buttonContainer}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          disabled={!startTime || isSaving}
          onClick={handleSave}
        >
          {isSaving ? (
            'Creating Request...'
          ) : (
            <>{props.task ? 'Request New Time' : 'Request Open House'}</>
          )}
        </Button>
      </div>
    </div>
  )
}

function getDefaultTime(): Date {
  return new Date(new Date().setHours(0, 0, 0, 0))
}

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
  return {
    updateTask: (...args: Parameters<typeof updateTask>) =>
      dispatch(updateTask(...args)),
    createRequestTask: (...args: Parameters<typeof createRequestTask>) =>
      dispatch(createRequestTask(...args))
  }
}

function mapStateToProps(
  { user, deals }: IAppState,
  ownProps: Props
): StateProps {
  return {
    user,
    checklists: getDealChecklists(ownProps.deal, deals.checklists)
  }
}

export default connect<StateProps, DispatchProps, Props>(
  mapStateToProps,
  mapDispatchToProps
)(OpenHouseForm)
