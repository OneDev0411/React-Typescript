import React, { useState, useContext, useEffect } from 'react'
import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'
import {
  Button,
  createStyles,
  makeStyles,
  Theme,
  Grid
} from '@material-ui/core'
import DayPicker from 'react-day-picker'
import fecha from 'fecha'

import useEffectOnce from 'react-use/lib/useEffectOnce'

import { createTaskComment } from 'deals/utils/create-task-comment'
import { createRequestTask } from 'actions/deals/helpers/create-request-task'
import { updateTask } from 'actions/deals'

import { IAppState } from 'reducers'
import { getDealChecklists } from 'reducers/deals/checklists'

import TimeInput from 'components/TimeInput'
import { InputLabel } from 'components/Forms/styled'
import { OpenHouseDrawer } from 'components/open-house/OpenHouseDrawer'
import ConfirmationModalContext from 'components/ConfirmationModal/context'

import getListing from 'models/listings/listing/get-listing'

import { addressTitle } from 'utils/listing'
import { normalizeListing } from 'views/utils/association-normalizers'

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
  autoBookOpenHouse: boolean
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
    timeInputContainer: {
      display: 'flex',
      flexDirection: 'column'
    },
    buttonLabel: {
      justifyContent: 'flex-start'
    }
  })
})

function OpenHouseForm(props: Props & StateProps & DispatchProps) {
  const { listing: listingId } = props.deal
  const classes = useStyles()

  const confirmation = useContext(ConfirmationModalContext)

  const [listing, setListing] = useState<IListing | null>(null)
  const [createdTask, setCreatedTask] = useState<IDealTask | null>(null)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [showOHRegistrationDrawer, setShowOHRegistrationDrawer] = useState<
    boolean
  >(false)

  const [startTime, setStartTime] = useState<Date | null>(
    props.defaultStartTime ? new Date(props.defaultStartTime * 1000) : null
  )
  const [endTime, setEndTime] = useState<Date | null>(
    props.defaultEndTime ? new Date(props.defaultEndTime * 1000) : null
  )

  useEffect(() => {
    async function fetchLisitng() {
      try {
        if (listingId && listing == null) {
          const response = await getListing(listingId)

          setListing(response)
        }
      } catch (error) {
        console.log(error)
      }
    }

    fetchLisitng()
  }, [listing, listingId])

  useEffectOnce(() => {
    props.autoBookOpenHouse && handleSave()
  })

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

    if (!task) {
      return
    }

    setCreatedTask(task)

    if (props.autoBookOpenHouse) {
      props.onUpsertTask(task)

      return
    }

    if (props.deal.listing) {
      confirmation.setConfirmationModal({
        message:
          'Would you also like an Open House Registration Page for this event?',
        confirmLabel: 'Yes',
        cancelLabel: 'No',
        onConfirm: () => setShowOHRegistrationDrawer(true),
        onCancel: () => props.onUpsertTask(task)
      })
    } else {
      props.onUpsertTask(task)
    }
  }

  const handleCloseOHRegistrationDrawer = () => {
    setShowOHRegistrationDrawer(false)
    props.onUpsertTask(createdTask!)
  }

  const getOpenHouseIntialValues = () => {
    // MLS listting is mandatory for creating an open house from its drawer
    if (listing) {
      return {
        assignees: [props.user],
        registrants: [],
        endDate: endTime,
        dueDate: startTime,
        location: {
          association_type: 'listing',
          index: 1,
          listing: normalizeListing(listing)
        },
        reminder: {
          title: 'None',
          value: -1
        },
        title: (listing && addressTitle(listing.property.address)) || ''
      }
    }
  }

  if (props.autoBookOpenHouse && isSaving) {
    return <div className={classes.root}>Creating Open House Request ...</div>
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
      <Grid container spacing={1}>
        <Grid item xs={6} className={classes.timeInputContainer}>
          <InputLabel>From</InputLabel>
          <TimeInput
            id="start-time"
            defaultDate={getDefaultTime()}
            initialDate={startTime}
            onChange={handleChangeStartTime}
          />
        </Grid>
        <Grid item xs={6} className={classes.timeInputContainer}>
          <InputLabel>To</InputLabel>

          <TimeInput
            id="end-time"
            defaultDate={getDefaultTime()}
            initialDate={endTime}
            onChange={handleSetEndTime}
          />
        </Grid>
      </Grid>

      <div className={classes.buttonContainer}>
        <Button
          fullWidth
          variant="contained"
          color="secondary"
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

      {showOHRegistrationDrawer && (
        // @ts-ignore js component
        <OpenHouseDrawer
          isOpen
          dealNotifyOffice={false}
          user={props.user}
          associations={{ deal: props.deal }}
          submitCallback={handleCloseOHRegistrationDrawer}
          onClose={handleCloseOHRegistrationDrawer}
          initialValues={getOpenHouseIntialValues()}
        />
      )}
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
