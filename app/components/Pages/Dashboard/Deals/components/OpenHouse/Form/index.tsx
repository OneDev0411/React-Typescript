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
  createRequestTask: IAsyncActionProp<typeof createRequestTask>
}

interface Props {
  deal: IDeal
  task: IDealTask | null
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
  const [startTime, setStartTime] = useState<Date>(new Date())
  const [endTime, setEndTime] = useState<Date | null>(null)

  const handleSetStartDate = (date: Date) => {
    const datetime = new Date(date)

    datetime.setHours(startTime.getHours())
    datetime.setMinutes(startTime.getMinutes())

    setStartTime(datetime)
  }

  const handleSetEndTime = (date: Date) => {
    if (new Date(date) > new Date(startTime)) {
      setEndTime(date)
    }
  }

  const handleSave = async (): Promise<void> => {
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

      props.onUpsertTask(props.task)

      return
    }

    setIsSaving(true)

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
          initialMonth={startTime}
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
            initialDate={startTime}
            onChange={setStartTime}
          />
        </div>
      </div>

      <div className={classes.fieldContainer}>
        {!endTime ? (
          <Button
            variant="text"
            color="primary"
            onClick={() => setEndTime(new Date())}
          >
            Add End Time
          </Button>
        ) : (
          <>
            <InputLabel>To</InputLabel>

            <Flex alignCenter justifyBetween>
              <TimeInput
                id="end-time"
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

      <div className={classes.buttonContainer}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          disabled={isSaving}
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

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
  return {
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
