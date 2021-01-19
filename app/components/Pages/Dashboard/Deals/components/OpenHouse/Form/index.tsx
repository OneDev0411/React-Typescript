import React, { useState, useContext, useEffect } from 'react'
import { useSelector } from 'react-redux'
import {
  Box,
  Button,
  createStyles,
  makeStyles,
  Theme,
  Grid,
  Checkbox,
  FormControlLabel,
  TextField
} from '@material-ui/core'
import DayPicker from 'react-day-picker'
import fecha from 'fecha'

import useEffectOnce from 'react-use/lib/useEffectOnce'

import { createTaskComment } from 'deals/utils/create-task-comment'
import { createRequestTask } from 'actions/deals/helpers/create-request-task'
import { updateTask, changeNeedsAttention } from 'actions/deals'

import { IAppState } from 'reducers'
import { getDealChecklists } from 'reducers/deals/checklists'

import TimeInput from 'components/TimeInput'
import { InputLabel } from 'components/Forms/styled'
import { OpenHouseDrawer } from 'components/open-house/OpenHouseDrawer'
import ConfirmationModalContext from 'components/ConfirmationModal/context'

import getListing from 'models/listings/listing/get-listing'

import { addressTitle } from 'utils/listing'
import { normalizeListing } from 'views/utils/association-normalizers'

import { useReduxDispatch } from 'hooks/use-redux-dispatch'

import { selectUser } from 'selectors/user'

import { DatePickerContainer } from './styled'

interface Props {
  deal: IDeal
  task: IDealTask | null
  autoBookOpenHouse: boolean
  defaultStartDate: number | null
  defaultEndDate: number | null
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
    virtualContainer: {
      margin: theme.spacing(1, 0)
    },
    flexContainer: {
      display: 'flex'
    },
    buttonLabel: {
      justifyContent: 'flex-start'
    }
  })
})

function OpenHouseForm(props: Props) {
  const { listing: listingId } = props.deal
  const classes = useStyles()
  const dispatch = useReduxDispatch()

  const checklists = useSelector<IAppState, IDealChecklist[]>(({ deals }) =>
    getDealChecklists(props.deal, deals.checklists)
  )
  const user = useSelector(selectUser)

  const confirmation = useContext(ConfirmationModalContext)

  const [listing, setListing] = useState<IListing | null>(null)
  const [createdTask, setCreatedTask] = useState<IDealTask | null>(null)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [isVirtual, setIsVirtual] = useState(false)
  const [virtualUrl, setVirtualUrl] = useState('')
  const [showOHRegistrationDrawer, setShowOHRegistrationDrawer] = useState<
    boolean
  >(false)

  const [startDate, setStartDate] = useState<Date>(
    props.defaultStartDate
      ? new Date(props.defaultStartDate * 1000)
      : new Date(new Date().setHours(10, 0, 0))
  )
  const [endDate, setEndDate] = useState<Date>(
    props.defaultEndDate
      ? new Date(props.defaultEndDate * 1000)
      : new Date(new Date().setHours(12, 0, 0))
  )

  const isFormValid = isVirtual ? virtualUrl.length > 0 : true

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

  const onChangeDay = (date: Date) => {
    const newStartDate = new Date(date)
    const newEndDate = new Date(date)

    newStartDate.setHours(startDate.getHours(), startDate.getMinutes())
    newEndDate.setHours(endDate.getHours(), endDate.getMinutes())

    setStartDate(new Date(newStartDate))
    setEndDate(new Date(newEndDate))
  }

  const handleSave = async (): Promise<void> => {
    if (!startDate) {
      return
    }

    setIsSaving(true)

    const checklist = checklists.find(
      checklist => checklist.checklist_type === 'Selling'
    )!

    const taskTitle = [
      fecha.format(startDate, 'dddd, MMMM D, YYYY  hh:mmA'),
      endDate ? `- ${fecha.format(endDate, 'hh:mmA')}` : ''
    ].join(' ')

    if (props.task) {
      createTaskComment(
        props.task,
        user.id,
        `Please change open house time to:\n ${taskTitle}`
      )

      await dispatch(
        updateTask(props.task.id, {
          title: `Update Open House to ${taskTitle}`
        })
      )

      dispatch(changeNeedsAttention(props.deal.id, props.task.id, true))

      props.onUpsertTask(props.task)

      setIsSaving(false)

      return
    }

    const taskComment = `Please create an open house for this date:\n${taskTitle}\n${virtualUrl}`

    const task = await dispatch(
      createRequestTask({
        checklist,
        userId: user.id,
        dealId: props.deal.id,
        taskType: 'OpenHouse',
        taskTitle: `${isVirtual ? 'Virtual ' : ''}Open House: ${taskTitle}`,
        taskComment,
        notifyMessage: 'Back office has been notified'
      })
    )

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
        assignees: [user],
        registrants: [],
        endDate,
        dueDate: startDate,
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
          initialMonth={startDate}
          selectedDays={startDate}
          disabledDays={{
            before: new Date()
          }}
          onDayClick={onChangeDay}
        />
      </DatePickerContainer>
      <Grid container spacing={1}>
        <Grid item xs={6} direction="column" className={classes.flexContainer}>
          <InputLabel>From</InputLabel>
          <TimeInput
            id="start-time"
            initialDate={startDate}
            onChange={setStartDate}
          />
        </Grid>
        <Grid item xs={6} direction="column" className={classes.flexContainer}>
          <InputLabel>To</InputLabel>

          <TimeInput
            id="end-time"
            initialDate={endDate}
            onChange={setEndDate}
          />
        </Grid>
      </Grid>

      <Box className={classes.virtualContainer}>
        <FormControlLabel
          control={
            <Checkbox
              checked={isVirtual}
              onChange={(_, checked: boolean) => setIsVirtual(checked)}
              name="virtual"
              color="primary"
            />
          }
          label="Virtual Open House"
        />

        <div>
          {isVirtual && (
            <TextField
              value={virtualUrl}
              label="Url"
              variant="outlined"
              size="small"
              placeholder="Enter URL for virtual open house"
              fullWidth
              onChange={e => setVirtualUrl(e.target.value)}
            />
          )}
        </div>
      </Box>

      <div className={classes.buttonContainer}>
        <Button
          fullWidth
          variant="contained"
          color="secondary"
          disabled={isSaving || !isFormValid}
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
          user={user}
          associations={{ deal: props.deal }}
          submitCallback={handleCloseOHRegistrationDrawer}
          onClose={handleCloseOHRegistrationDrawer}
          initialValues={getOpenHouseIntialValues()}
        />
      )}
    </div>
  )
}

export default OpenHouseForm
